import { PrismaClient } from "@prisma/client"

const createPrismaClient = () => {
    return new PrismaClient().$extends({
        query: {
            $allModels: {
                async deleteMany({ model, args, query }) {
                    if (!args || !args.where || Object.keys(args.where).length === 0) {
                        throw new Error(`[Prisma Security Guard] Blocked empty deleteMany on ${model}. To delete all records, truncate the table manually.`);
                    }
                    return query(args);
                },
                async updateMany({ model, args, query }) {
                    if (!args || !args.where || Object.keys(args.where).length === 0) {
                        throw new Error(`[Prisma Security Guard] Blocked empty updateMany on ${model}.`);
                    }
                    return query(args);
                }
            }
        }
    })
}

type ExtendedPrismaClient = ReturnType<typeof createPrismaClient>

const globalForPrisma = globalThis as unknown as {
    prisma: ExtendedPrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma
