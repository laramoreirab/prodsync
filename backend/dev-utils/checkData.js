import prisma from "../config/prisma.js";

async function check() {
  const id_empresa = 1;
  try {
    const setores = await prisma.setores.findMany({
      include: {
        maquinas: { include: { operador: true } },
        escalas: { include: { operador: true } },
        gestores: { include: { gestor: true } }
      }
    });

    console.log("=== RELATÓRIO DE SETORES ===");
    setores.forEach(s => {
      const operadores = new Set();
      s.maquinas.forEach(m => m.operador && operadores.add(m.operador.nome));
      s.escalas.forEach(e => operadores.add(e.operador.nome));
      s.gestores.forEach(g => operadores.add(g.gestor.nome));

      console.log(`Setor: ${s.nome_setor} (ID: ${s.id_setor})`);
      console.log(`- Usuários encontrados: ${Array.from(operadores).join(", ") || "Nenhum"}`);
    });

  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

check();
