import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { isRateLimited } from "@/lib/rate-limit"

const ALLOWED_SIMULATION_TYPES = new Set(["AI_ESTIMATION", "PRICING_SIMULATION"])
const MAX_INPUT_PARAMS_BYTES = 10 * 1024

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "anonymous"
    const { limited, remaining, reset } = isRateLimited(`simulation-log:${ip}`)
    const headers = {
      "X-RateLimit-Limit": "60",
      "X-RateLimit-Remaining": remaining.toString(),
      "X-RateLimit-Reset": reset.toString(),
    }

    if (limited) {
      return NextResponse.json({ error: "Too Many Requests" }, { status: 429, headers })
    }

    const body = await req.json()
    const { type, inputParams, resultAmount } = body

    if (!type || !inputParams || resultAmount === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400, headers })
    }

    if (!ALLOWED_SIMULATION_TYPES.has(type)) {
      return NextResponse.json({ error: "Invalid simulation type" }, { status: 400, headers })
    }

    if (typeof resultAmount !== "number" || !Number.isFinite(resultAmount)) {
      return NextResponse.json({ error: "Invalid resultAmount" }, { status: 400, headers })
    }

    if (inputParams === null || typeof inputParams !== "object" || Array.isArray(inputParams)) {
      return NextResponse.json({ error: "Invalid inputParams" }, { status: 400, headers })
    }

    let serializedInputParams: string
    try {
      serializedInputParams = JSON.stringify(inputParams)
    } catch {
      return NextResponse.json({ error: "Invalid inputParams" }, { status: 400, headers })
    }

    if (!serializedInputParams || serializedInputParams.length > MAX_INPUT_PARAMS_BYTES) {
      return NextResponse.json({ error: "inputParams is too large" }, { status: 400, headers })
    }

    const ipAddress = ip === "anonymous" ? null : ip
    const userAgent = req.headers.get("user-agent") || null

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = prisma as any
    const log = await db.simulationLog.create({
      data: {
        type,
        inputParams,
        resultAmount,
        ipAddress,
        userAgent,
      },
    })

    return NextResponse.json({ success: true, id: log.id }, { headers })
  } catch (error) {
    console.error("[SIMULATION_LOG_ERROR]", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
