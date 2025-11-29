import 'dotenv/config'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@/lib/generated/prisma/client'
import {withAccelerate} from '@prisma/extension-accelerate';
const connectionString = `${process.env.DATABASE_URL}`
const adapter = new PrismaPg({connectionString})
const globalForPrisma = globalThis as unknown as {
    prisma:PrismaClient
}

const prisma = globalForPrisma.prisma || new PrismaClient({adapter}).$extends(withAccelerate())
if(process.env.NODE_ENV!=="production") globalForPrisma.prisma=prisma
export {prisma}
