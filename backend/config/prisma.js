import 'dotenv/config'
import pkg from '@prisma/client';
const { PrismaClient } = pkg;
import { PrismaNeon } from '@prisma/adapter-neon'

const adapter = new PrismaNeon({
    connectionString: process.env.DATABASE_URL,
})

export const prisma = new PrismaClient({ adapter })