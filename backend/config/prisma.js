// config/prisma.js
import { PrismaClient } from '@prisma/client';
import pg from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

// Cria a pool de conexão padrão do Node
const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL
});

// Inicializa o adapter
const adapter = new PrismaPg(pool);

// Passa o adapter para o PrismaClient
const prisma = new PrismaClient({ adapter });

export default prisma;