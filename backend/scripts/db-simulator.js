import 'dotenv/config';
import prisma from '../config/prisma.js';
import NotificacaoModel from '../models/NotificacaoModel.js';
import TurnoModel from '../models/TurnoModel.js';
import { fileURLToPath } from 'url';

const DIAS_SEMANA = ['Domingo', 'Segunda', 'Terca', 'Quarta', 'Quinta', 'Sexta', 'Sabado'];
const STATUS_OP_ATIVOS = ['Em_Andamento', 'Parada', 'Setup', 'Aguardando'];
const STATUS_PARADA = ['Parada', 'Setup', 'Manutencao'];

const config = {
  empresaIds: parseIds(process.env.SIMULATOR_EMPRESA_IDS ?? process.env.SIMULATOR_EMPRESA_ID ?? '11,12,9,26'),
  intervalMs: Number(process.env.SIMULATOR_INTERVAL_MS ?? 60000),
  batchSize: Number(process.env.SIMULATOR_BATCH_SIZE ?? 4),
  historyDays: Number(process.env.SIMULATOR_HISTORY_DAYS ?? 7),
  createSupportData: process.env.SIMULATOR_CREATE_SUPPORT_DATA !== 'false',
  createOrders: process.env.SIMULATOR_CREATE_ORDERS !== 'false',
};

const produtos = [
  'Eixo usinado',
  'Suporte metalico',
  'Carcaça de bomba',
  'Engrenagem',
  'Flange industrial',
  'Conjunto montado',
  'Peça seriada',
];

const motivosPadrao = [
  { descricao: 'Falta de material', tipo: 'Nao_Programada' },
  { descricao: 'Troca de ferramenta', tipo: 'Programada' },
  { descricao: 'Setup de lote', tipo: 'Programada' },
  { descricao: 'Ajuste de sensor', tipo: 'Nao_Programada' },
  { descricao: 'Manutencao preventiva', tipo: 'Programada' },
  { descricao: 'Inspeção de qualidade', tipo: 'Programada' },
];

function parseIds(value) {
  return String(value)
    .split(',')
    .map((item) => Number(item.trim()))
    .filter((id) => Number.isInteger(id) && id > 0);
}

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const sample = (items) => items[Math.floor(Math.random() * items.length)];
const chance = (probability) => Math.random() < probability;

function uniqueBy(items, key) {
  return [...new Map(items.map((item) => [item[key], item])).values()];
}

function timeOnly(hours, minutes = 0) {
  return new Date(Date.UTC(1970, 0, 1, hours, minutes, 0, 0));
}

function minutesAgo(minutes) {
  return new Date(Date.now() - minutes * 60 * 1000);
}

function addDays(date, days) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function setRandomTime(date, minHour = 6, maxHour = 20) {
  const next = new Date(date);
  next.setHours(randomInt(minHour, maxHour), randomInt(0, 55), 0, 0);
  return next;
}

async function getEmpresasAlvo() {
  if (config.empresaIds.length === 0) {
    throw new Error('Nenhum id de empresa valido em SIMULATOR_EMPRESA_IDS.');
  }

  const empresas = await prisma.empresas.findMany({
    where: { id_empresa: { in: config.empresaIds } },
    orderBy: { id_empresa: 'asc' },
  });

  const encontradas = new Set(empresas.map((empresa) => empresa.id_empresa));
  const ausentes = config.empresaIds.filter((id) => !encontradas.has(id));
  if (ausentes.length > 0) {
    console.warn(`[simulador] Empresas nao encontradas e ignoradas: ${ausentes.join(', ')}`);
  }

  return empresas;
}

async function ensureMotivos(id_empresa) {
  const existentes = await prisma.motivos_Parada.findMany({ where: { id_empresa } });
  if (!config.createSupportData || existentes.length > 0) return existentes;

  for (const motivo of motivosPadrao) {
    await prisma.motivos_Parada.create({
      data: { id_empresa, ...motivo },
    });
  }

  return prisma.motivos_Parada.findMany({ where: { id_empresa } });
}

async function ensureTurnos(id_empresa) {
  const existentes = await prisma.turno.findMany({ where: { id_empresa } });
  if (!config.createSupportData || existentes.length > 0) return existentes;

  const turnos = [];
  for (const dia_semana of DIAS_SEMANA) {
    turnos.push(
      { id_empresa, dia_semana, nome_turno: 'Manha Auto', hora_inicio: timeOnly(6), hora_fim: timeOnly(14) },
      { id_empresa, dia_semana, nome_turno: 'Tarde Auto', hora_inicio: timeOnly(14), hora_fim: timeOnly(22) },
      { id_empresa, dia_semana, nome_turno: 'Noite Auto', hora_inicio: timeOnly(22), hora_fim: timeOnly(6) },
    );
  }

  await prisma.turno.createMany({ data: turnos });
  return prisma.turno.findMany({ where: { id_empresa } });
}

async function ensureSupportData(id_empresa) {
  const [motivos, turnos] = await Promise.all([
    ensureMotivos(id_empresa),
    ensureTurnos(id_empresa),
  ]);

  return { motivos, turnos };
}

async function getTurnoParaData(id_empresa, data) {
  return TurnoModel.obterTurnoAtual(id_empresa, data)
    ?? prisma.turno.findFirst({ where: { id_empresa, dia_semana: DIAS_SEMANA[data.getDay()] } })
    ?? prisma.turno.findFirst({ where: { id_empresa } });
}

async function getMaquinasElegiveis(id_empresa) {
  const maquinas = await prisma.maquinas.findMany({
    where: { id_empresa, ativo: true },
    include: {
      operador: { select: { id_usuario: true, nome: true } },
      setor: { select: { id_setor: true, nome_setor: true } },
      escala_trabalho: {
        include: {
          operador: { select: { id_usuario: true, nome: true } },
          setor: { select: { id_setor: true, nome_setor: true } },
          turno: { select: { id_turno: true, nome_turno: true } },
        },
        take: 5,
      },
    },
    orderBy: { id_maquina: 'asc' },
  });

  return maquinas
    .map((maquina) => {
      const escala = maquina.escala_trabalho.find((item) => item.id_maquina === maquina.id_maquina)
        ?? maquina.escala_trabalho[0]
        ?? null;
      const operador = maquina.operador ?? escala?.operador ?? null;
      const id_setor = maquina.id_setor ?? escala?.id_setor ?? null;

      if (!operador || !id_setor) return null;

      return {
        ...maquina,
        id_operador_simulado: operador.id_usuario,
        nome_operador_simulado: operador.nome,
        id_setor_simulado: id_setor,
        nome_setor_simulado: maquina.setor?.nome_setor ?? escala?.setor?.nome_setor ?? null,
      };
    })
    .filter(Boolean);
}

async function getGestorParaSetor(id_empresa, id_setor) {
  const gestorSetor = await prisma.setor_Gestor.findFirst({
    where: { id_empresa, id_setor },
    include: { gestor: { select: { id_usuario: true, nome: true, tipo: true } } },
  });
  if (gestorSetor?.gestor) return gestorSetor.gestor;

  return prisma.usuarios.findFirst({
    where: { id_empresa, tipo: { in: ['Gestor', 'Adm'] } },
    select: { id_usuario: true, nome: true, tipo: true },
  });
}

async function registrarLogUsuario(id_empresa, usuario, rota, metodo = 'POST') {
  if (!usuario?.id_usuario) return;

  await prisma.logs.create({
    data: {
      usuario_id: usuario.id_usuario,
      rota,
      metodo,
      status_code: 200,
      ip_address: '127.0.0.1',
      user_agent: 'ProdSync DB Simulator',
      tempo_resposta_ms: randomInt(80, 1200),
      dados_requisicao: '{"simulado":true}',
      dados_resposta: '{"ok":true}',
      criado_em: minutesAgo(randomInt(0, 120)),
    },
  });
}

async function getOrCreateOrdemAtiva(id_empresa, maquina) {
  const existente = await prisma.ordemProducao.findFirst({
    where: {
      id_empresa,
      id_maquina: maquina.id_maquina,
      status_op: { in: STATUS_OP_ATIVOS },
    },
    orderBy: [{ data_inicio: 'desc' }, { id_ordem: 'desc' }],
  });

  if (existente) return existente;

  if (!config.createOrders) return null;

  const gestor = await getGestorParaSetor(id_empresa, maquina.id_setor_simulado);
  const codigo_lote = `AUTO-${id_empresa}-${maquina.id_maquina}-${Date.now()}-${randomInt(100, 999)}`;
  const ordem = await prisma.ordemProducao.create({
    data: {
      id_empresa,
      id_maquina: maquina.id_maquina,
      id_setor: maquina.id_setor_simulado,
      codigo_lote,
      produto: sample(produtos),
      qtd_planejada: randomInt(700, 3200),
      data_inicio: addDays(new Date(), -randomInt(0, 2)),
      data_fim: addDays(new Date(), randomInt(1, 5)),
      observacao_op: `OP criada automaticamente para simular producao real da maquina ${maquina.nome}.`,
      prioridade: sample(['Baixa', 'Media', 'Alta']),
      status_op: 'Aguardando',
      setores: { connect: [{ id_setor: maquina.id_setor_simulado }] },
    },
  });

  await registrarLogUsuario(id_empresa, gestor, '/api/ordens-producao', 'POST');
  return ordem;
}

async function closeOpenEvent(id_empresa, evento, motivos, termino = new Date()) {
  const motivo = sample(motivos);
  const duracao = Math.max(1, Math.round((termino - evento.inicio) / 1000 / 60));

  await prisma.historico_Eventos.update({
    where: { id_evento: evento.id_evento },
    data: {
      termino,
      duracao,
      id_motivo_parada: motivo.id_motivo,
      observacao: `Justificativa automatica: ${motivo.descricao}.`,
    },
  });

  await prisma.maquinas.updateMany({
    where: { id_empresa, id_maquina: evento.id_maquina },
    data: { status_atual: 'Produzindo', status: 'Produzindo', board_ultimo_contato_em: termino },
  });

  if (evento.id_ordemProducao) {
    await prisma.ordemProducao.updateMany({
      where: { id_empresa, id_ordem: evento.id_ordemProducao },
      data: { status_op: 'Em_Andamento', prioridade: 'Media' },
    });
  }
}

async function createApontamento(id_empresa, maquina, turno, ordem, dataInicio = null) {
  if (!ordem) return { apontamentos: 0, eventos: 0 };

  const duracao = randomInt(10, 42);
  const inicio = dataInicio ?? minutesAgo(duracao);
  const fim = new Date(inicio);
  fim.setMinutes(fim.getMinutes() + duracao);

  const totalPecas = randomInt(Math.max(20, duracao * 2), Math.max(35, duracao * 6));
  const qtd_refugo = chance(0.32) ? randomInt(1, Math.max(2, Math.round(totalPecas * 0.08))) : 0;
  const qtd_boa = Math.max(0, totalPecas - qtd_refugo);

  await prisma.apontamento.create({
    data: {
      id_empresa,
      id_ordemProducao: ordem.id_ordem,
      id_maquina: maquina.id_maquina,
      id_operador: maquina.id_operador_simulado,
      id_turno: turno.id_turno,
      qtd_boa,
      qtd_refugo,
      data_hora_inicio: inicio,
      data_hora_fim: fim,
      observacao: qtd_refugo > 0
        ? sample(['Rebarba', 'Medida fora do padrao', 'Falha visual', 'Retrabalho registrado'])
        : 'Apontamento de producao simulado.',
    },
  });

  await prisma.maquinas.updateMany({
    where: { id_empresa, id_maquina: maquina.id_maquina },
    data: {
      status_atual: 'Produzindo',
      status: 'Produzindo',
      id_operador: maquina.id_operador_simulado,
      id_setor: maquina.id_setor_simulado,
      board_ultimo_contato_em: fim,
    },
  });

  await prisma.ordemProducao.updateMany({
    where: { id_empresa, id_ordem: ordem.id_ordem },
    data: { status_op: 'Em_Andamento', prioridade: 'Media' },
  });

  await registrarLogUsuario(
    id_empresa,
    { id_usuario: maquina.id_operador_simulado },
    '/api/apontamentos',
    'POST',
  );

  const produzido = await prisma.apontamento.aggregate({
    where: { id_empresa, id_ordemProducao: ordem.id_ordem },
    _sum: { qtd_boa: true },
  });

  if ((produzido._sum.qtd_boa ?? 0) >= ordem.qtd_planejada) {
    await prisma.ordemProducao.updateMany({
      where: { id_empresa, id_ordem: ordem.id_ordem },
      data: {
        status_op: 'Finalizada',
        prioridade: 'Baixa',
        data_fim: fim,
      },
    });
  }

  return { apontamentos: 1, eventos: 0 };
}

async function createClosedEvent(id_empresa, maquina, turno, ordem, motivos, dataInicio = null) {
  const status = sample(STATUS_PARADA);
  const duracao = randomInt(5, status === 'Setup' ? 75 : 50);
  const inicio = dataInicio ?? minutesAgo(duracao);
  const termino = new Date(inicio);
  termino.setMinutes(termino.getMinutes() + duracao);
  const motivo = status === 'Setup'
    ? motivos.find((item) => item.descricao.toLowerCase().includes('setup')) ?? sample(motivos)
    : sample(motivos);

  await prisma.historico_Eventos.create({
    data: {
      id_empresa,
      id_maquina: maquina.id_maquina,
      id_ordemProducao: ordem?.id_ordem ?? null,
      id_turno: turno.id_turno,
      id_motivo_parada: motivo.id_motivo,
      status_atual: status,
      inicio,
      termino,
      duracao,
      observacao: `Evento simulado fechado: ${motivo.descricao}.`,
      setor_afetado: maquina.id_setor_simulado,
    },
  });

  await prisma.maquinas.updateMany({
    where: { id_empresa, id_maquina: maquina.id_maquina },
    data: { status_atual: 'Produzindo', status: 'Produzindo' },
  });

  return { apontamentos: 0, eventos: 1 };
}

async function createOpenEvent(id_empresa, maquina, turno, ordem) {
  const status = sample(['Parada', 'Setup']);
  const evento = await prisma.historico_Eventos.create({
    data: {
      id_empresa,
      id_maquina: maquina.id_maquina,
      id_ordemProducao: ordem?.id_ordem ?? null,
      id_turno: turno.id_turno,
      status_atual: status,
      inicio: minutesAgo(randomInt(2, 25)),
      observacao: '',
      setor_afetado: maquina.id_setor_simulado,
    },
  });

  await prisma.maquinas.updateMany({
    where: { id_empresa, id_maquina: maquina.id_maquina },
    data: {
      status_atual: status,
      status,
      id_operador: maquina.id_operador_simulado,
      id_setor: maquina.id_setor_simulado,
    },
  });

  if (ordem) {
    await prisma.ordemProducao.updateMany({
      where: { id_empresa, id_ordem: ordem.id_ordem },
      data: { status_op: status, prioridade: status === 'Parada' ? 'Critica' : 'Alta' },
    });
  }

  await NotificacaoModel.notificarEventoMaquina(id_empresa, evento, maquina.nome).catch((error) => {
    console.error('[simulador] Erro ao criar notificacoes:', error);
  });

  return { apontamentos: 0, eventos: 1 };
}

async function simulateEmpresa(empresa) {
  const id_empresa = empresa.id_empresa;
  const { motivos } = await ensureSupportData(id_empresa);
  const turno = await getTurnoParaData(id_empresa, new Date());
  const maquinas = await getMaquinasElegiveis(id_empresa);

  if (!turno) {
    console.warn(`[simulador] Empresa ${id_empresa} ignorada: nao ha turno cadastrado.`);
    return { empresas: 1, maquinas: 0, apontamentos: 0, eventos: 0, eventos_fechados: 0, ops_criadas: 0 };
  }

  if (motivos.length === 0) {
    console.warn(`[simulador] Empresa ${id_empresa} ignorada: nao ha motivos de parada.`);
    return { empresas: 1, maquinas: 0, apontamentos: 0, eventos: 0, eventos_fechados: 0, ops_criadas: 0 };
  }

  if (maquinas.length === 0) {
    console.warn(`[simulador] Empresa ${id_empresa} ignorada: nao ha maquinas ativas com operador ou escala.`);
    return { empresas: 1, maquinas: 0, apontamentos: 0, eventos: 0, eventos_fechados: 0, ops_criadas: 0 };
  }

  const selecionadas = uniqueBy(
    Array.from({ length: Math.min(config.batchSize, maquinas.length) }, () => sample(maquinas)),
    'id_maquina',
  );
  const stats = { empresas: 1, maquinas: selecionadas.length, apontamentos: 0, eventos: 0, eventos_fechados: 0, ops_criadas: 0 };

  for (const maquina of selecionadas) {
    const aberto = await prisma.historico_Eventos.findFirst({
      where: { id_empresa, id_maquina: maquina.id_maquina, termino: null },
      orderBy: [{ inicio: 'desc' }, { id_evento: 'desc' }],
    });

    if (aberto) {
      if (chance(0.72)) {
        await closeOpenEvent(id_empresa, aberto, motivos);
        stats.eventos_fechados += 1;
      }
      continue;
    }

    const ordemAntes = await prisma.ordemProducao.findFirst({
      where: { id_empresa, id_maquina: maquina.id_maquina, status_op: { in: STATUS_OP_ATIVOS } },
      select: { id_ordem: true },
    });
    const ordem = await getOrCreateOrdemAtiva(id_empresa, maquina);
    if (!ordem) continue;
    if (!ordemAntes) stats.ops_criadas += 1;

    const action = Math.random();
    const result = action < 0.68
      ? await createApontamento(id_empresa, maquina, turno, ordem)
      : action < 0.88
        ? await createClosedEvent(id_empresa, maquina, turno, ordem, motivos)
        : await createOpenEvent(id_empresa, maquina, turno, ordem);

    stats.apontamentos += result.apontamentos;
    stats.eventos += result.eventos;
  }

  return stats;
}

function sumStats(total, atual) {
  for (const [key, value] of Object.entries(atual)) {
    total[key] = (total[key] ?? 0) + value;
  }
  return total;
}

async function simulateCycle() {
  const empresas = await getEmpresasAlvo();
  const total = { empresas: 0, maquinas: 0, apontamentos: 0, eventos: 0, eventos_fechados: 0, ops_criadas: 0 };

  for (const empresa of empresas) {
    sumStats(total, await simulateEmpresa(empresa));
  }

  console.log(
    `[simulador] ciclo empresas=${total.empresas} maquinas=${total.maquinas} ` +
    `ops_criadas=${total.ops_criadas} apontamentos=${total.apontamentos} ` +
    `eventos=${total.eventos} eventos_fechados=${total.eventos_fechados}`,
  );

  return total;
}

async function backfillEmpresa(empresa) {
  const id_empresa = empresa.id_empresa;
  const { motivos } = await ensureSupportData(id_empresa);
  const maquinas = await getMaquinasElegiveis(id_empresa);
  const stats = { empresas: 1, maquinas: maquinas.length, apontamentos: 0, eventos: 0, eventos_fechados: 0, ops_criadas: 0 };

  if (maquinas.length === 0 || motivos.length === 0) return stats;

  for (let daysAgo = config.historyDays; daysAgo >= 1; daysAgo -= 1) {
    const date = addDays(new Date(), -daysAgo);
    const turno = await getTurnoParaData(id_empresa, date);
    if (!turno) continue;

    for (const maquina of maquinas) {
      const ordemAntes = await prisma.ordemProducao.findFirst({
        where: { id_empresa, id_maquina: maquina.id_maquina, status_op: { in: STATUS_OP_ATIVOS } },
        select: { id_ordem: true },
      });
      const ordem = await getOrCreateOrdemAtiva(id_empresa, maquina);
      if (!ordem) continue;
      if (!ordemAntes) stats.ops_criadas += 1;

      const apontamentosDia = randomInt(2, 5);
      for (let count = 0; count < apontamentosDia; count += 1) {
        const inicio = setRandomTime(date);
        const result = await createApontamento(id_empresa, maquina, turno, ordem, inicio);
        stats.apontamentos += result.apontamentos;
      }

      if (chance(0.38)) {
        const result = await createClosedEvent(id_empresa, maquina, turno, ordem, motivos, setRandomTime(date, 7, 18));
        stats.eventos += result.eventos;
      }
    }
  }

  return stats;
}

async function backfillHistory() {
  const empresas = await getEmpresasAlvo();
  const total = { empresas: 0, maquinas: 0, apontamentos: 0, eventos: 0, eventos_fechados: 0, ops_criadas: 0 };

  for (const empresa of empresas) {
    sumStats(total, await backfillEmpresa(empresa));
  }

  console.log(
    `[simulador] historico gerado dias=${config.historyDays} empresas=${total.empresas} ` +
    `apontamentos=${total.apontamentos} eventos=${total.eventos} ops_criadas=${total.ops_criadas}`,
  );
}

async function seedSupportData() {
  const empresas = await getEmpresasAlvo();
  for (const empresa of empresas) {
    await ensureSupportData(empresa.id_empresa);
  }
  console.log(`[simulador] dados de apoio garantidos para empresas: ${empresas.map((item) => item.id_empresa).join(', ')}`);
}

async function run() {
  const args = new Set(process.argv.slice(2));

  if (args.has('--seed-only')) {
    await seedSupportData();
    return;
  }

  if (args.has('--backfill')) {
    await backfillHistory();
    return;
  }

  if (args.has('--once')) {
    await simulateCycle();
    return;
  }

  await seedSupportData();
  console.log(`[simulador] rodando empresas=${config.empresaIds.join(',')} intervalo=${config.intervalMs}ms.`);
  await simulateCycle();

  const timer = setInterval(() => {
    simulateCycle().catch((error) => {
      console.error('[simulador] erro no ciclo:', error);
    });
  }, config.intervalMs);

  process.on('SIGINT', () => {
    clearInterval(timer);
    prisma.$disconnect().finally(() => process.exit(0));
  });

  process.on('SIGTERM', () => {
    clearInterval(timer);
    prisma.$disconnect().finally(() => process.exit(0));
  });
}

const executadoDiretamente = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];

if (executadoDiretamente) {
  run()
    .catch((error) => {
      console.error('[simulador] erro fatal:', error);
      process.exitCode = 1;
    })
    .finally(async () => {
      if (process.argv.includes('--once') || process.argv.includes('--seed-only') || process.argv.includes('--backfill')) {
        await prisma.$disconnect();
      }
    });
}

export { backfillHistory, seedSupportData, simulateCycle };
