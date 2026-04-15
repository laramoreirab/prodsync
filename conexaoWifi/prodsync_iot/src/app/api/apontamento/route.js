import { NextResponse } from 'next/server';
// Aqui você importaria o seu client do banco de dados (Prisma, mysql2, etc)
// import db from '@/lib/db'; 

export async function POST(request) {
  try {
    // 1. Recebe o JSON enviado pelo ESP32
    const body = await request.json();
    const { maquina_id, status } = body;

    // 2. Validação Básica
    if (!maquina_id || !status) {
      return NextResponse.json(
        { erro: "Máquina ID e Status são obrigatórios." },
        { status: 400 }
      );
    }

    // 3. O Pulo do Gato: Carimbo de tempo no Servidor!
    // Geramos o momento exato em que a informação chegou
    const timestampAtual = new Date(); 

    console.log(`[API] Máquina ${maquina_id} mudou para: ${status} em ${timestampAtual.toISOString()}`);

    // 4. Lógica de Banco de Dados (Exemplo com pseudo-código)
    /*
      AQUI ACONTECE A MÁGICA DAS SÉRIES TEMPORAIS:
      
      a) Buscar qual era o último status dessa máquina no banco.
      b) Calcular a diferença de tempo entre o 'timestamp' do último status e o 'timestampAtual'.
      c) Atualizar o registro anterior com a duração exata e fechá-lo.
      d) Inserir um NOVO registro na tabela 'Eventos_Maquina' com o novo status e o 'timestampAtual'.
      
      Exemplo usando um ORM fictício:
      await db.eventos.create({
        data: {
          maquinaId: maquina_id,
          status: status,
          dataInicio: timestampAtual
        }
      });
    */

    // 5. Retorna sucesso para o ESP32 (para ele não tentar reenviar)
    return NextResponse.json({ sucesso: true, mensagem: "Status recebido com sucesso!" });

  } catch (error) {
    console.error("Erro ao processar apontamento:", error);
    return NextResponse.json(
      { erro: "Erro interno no servidor." },
      { status: 500 }
    );
  }
}