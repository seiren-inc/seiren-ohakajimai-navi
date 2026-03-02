import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { type, inputParams, resultAmount } = body

    if (!type || !inputParams || resultAmount === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const ipAddress = req.headers.get("x-forwarded-for")?.split(",")[0] || null
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

    return NextResponse.json({ success: true, id: log.id })
  } catch (error) {
    console.error("[SIMULATION_LOG_ERROR]", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
