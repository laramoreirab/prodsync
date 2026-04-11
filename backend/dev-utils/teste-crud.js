import 'dotenv/config'; // Puxa a url do seu arquivo .env no padrão moderno
import { PrismaClient } from '@prisma/client';
import pg from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const { Pool } = pg;

// 1. Pega a URL de conexão
const connectionString = process.env.DATABASE_URL;

// 2. Cria a conexão com o banco usando o driver do Postgres
const pool = new Pool({ connectionString });

// 3. Cria o "adaptador" que faz o Postgres conversar com o Prisma 7
const adapter = new PrismaPg(pool);

// 4. Inicia o Prisma
const prisma = new PrismaClient({ adapter });

async function main() {
  const cnpjTeste = `12.345.${Math.floor(100 + Math.random() * 900)}/0001-99`;

  console.log('--- Iniciando Teste CRUD na tabela Empresas ---');

  // 1. CREATE
  const novaEmpresa = await prisma.empresas.create({
    data: { 
      nome_empresa: 'Empresa teste', 
      cnpj: cnpjTeste,
      email: `teste-${Date.now()}@exemplo.com`,
      telefone: '(11) 98765-4326'
    },
  });
  console.log('\n✅ CREATE: Empresa criada!');
  console.log(novaEmpresa);

}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });