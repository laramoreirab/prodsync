import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();

//esse arquivo exporta os módulos como: read, create, findMany etc...

export default prisma;