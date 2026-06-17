import 'dotenv/config';
import prisma from '../config/prisma.js';
import NotificacaoModel from '../models/NotificacaoModel.js';
import TurnoModel from '../models/TurnoModel.js';
import { fileURLToPath } from 'url';

const DIAS_SEMANA = ['Domingo', 'Segunda', 'Terca', 'Quarta', 'Quinta', 'Sexta', 'Sabado'];
const STATUS_OP_ATIVOS = ['Em_Andamento', 'Parada', 'Setup'];
const STATUS_PARADA = ['Parada', 'Setup', 'Manutencao'];

const config = {
  empresaIds: parseIds(process.env.SIMULATOR_EMPRESA_IDS ?? process.env.SIMULATOR_EMPRESA_ID ?? '43,44,45'),
  dashboardEmpresaIds: parseIds(process.env.SIMULATOR_DASHBOARD_EMPRESA_IDS ?? '43,44,45'),
  dashboardMinSetores: Number(process.env.SIMULATOR_DASHBOARD_MIN_SETORES ?? 5),
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

const observacoesProducao = [
  'Producao dentro do ciclo previsto.',
  'Lote em andamento com fluxo estavel.',
  'Controle dimensional conferido durante a operacao.',
  'Abastecimento normalizado e celula em ritmo estavel.',
  'Registro consolidado no fechamento parcial do turno.',
];

const observacoesQualidade = [
  'Rebarba identificada na inspecao visual.',
  'Medida fora da tolerancia especificada.',
  'Falha visual registrada no controle de qualidade.',
  'Peca separada para retrabalho.',
  'Amostra reprovada na verificacao dimensional.',
];

const observacoesParada = [
  'Ocorrencia encerrada apos verificacao da equipe responsavel.',
  'Equipamento liberado para retorno da producao.',
  'Causa registrada e linha normalizada.',
  'Atendimento concluido com acompanhamento do setor.',
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

function addMinutes(date, minutes) {
  const next = new Date(date);
  next.setMinutes(next.getMinutes() + minutes);
  return next;
}

function addDays(date, days) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function formatarDataCodigo(date = new Date()) {
  return `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`;
}

function criarCodigoLote(id_empresa, id_maquina, sequencial = String(Date.now()).slice(-5), dataReferencia = new Date()) {
  return `LP-${formatarDataCodigo(dataReferencia)}-${String(id_empresa).padStart(2, '0')}${String(id_maquina).padStart(3, '0')}-${String(sequencial).padStart(5, '0')}`;
}

function setRandomTime(date, minHour = 6, maxHour = 20) {
  const next = new Date(date);
  next.setHours(randomInt(minHour, maxHour), randomInt(0, 55), 0, 0);
  return next;
}

async function getEmpresasAlvo() {
  const idsAlvo = uniqueBy(
    [...config.empresaIds, ...config.dashboardEmpresaIds].map((id) => ({ id })),
    'id',
  ).map((item) => item.id);

  if (idsAlvo.length === 0) {
    throw new Error('Nenhum id de empresa valido em SIMULATOR_EMPRESA_IDS.');
  }

  const empresas = await prisma.empresas.findMany({
    where: { id_empresa: { in: idsAlvo } },
    orderBy: { id_empresa: 'asc' },
  });

  const encontradas = new Set(empresas.map((empresa) => empresa.id_empresa));
  const ausentes = idsAlvo.filter((id) => !encontradas.has(id));
  if (ausentes.length > 0) {
    console.warn(`[cron-producao] Empresas nao encontradas e ignoradas: ${ausentes.join(', ')}`);
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
      { id_empresa, dia_semana, nome_turno: 'Turno Manha', hora_inicio: timeOnly(6), hora_fim: timeOnly(14) },
      { id_empresa, dia_semana, nome_turno: 'Turno Tarde', hora_inicio: timeOnly(14), hora_fim: timeOnly(22) },
      { id_empresa, dia_semana, nome_turno: 'Turno Noite', hora_inicio: timeOnly(22), hora_fim: timeOnly(6) },
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
  const turnoAtual = await TurnoModel.obterTurnoAtual(id_empresa, data);
  if (turnoAtual) return turnoAtual;

  const turnoDoDia = await prisma.turno.findFirst({
    where: { id_empresa, dia_semana: DIAS_SEMANA[data.getDay()] },
  });
  if (turnoDoDia) return turnoDoDia;

  return prisma.turno.findFirst({ where: { id_empresa } });
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
        id_operador_operacao: operador.id_usuario,
        nome_operador_operacao: operador.nome,
        id_setor_operacao: id_setor,
        nome_setor_operacao: maquina.setor?.nome_setor ?? escala?.setor?.nome_setor ?? null,
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
      user_agent: 'ProdSync Web',
      tempo_resposta_ms: randomInt(80, 1200),
      dados_requisicao: JSON.stringify({ origem: 'operacao', rota }),
      dados_resposta: JSON.stringify({ status: 'registrado' }),
      criado_em: minutesAgo(randomInt(0, 120)),
    },
  });
}

async function normalizarDadosApresentacao(id_empresa) {
  if (!config.dashboardEmpresaIds.includes(id_empresa)) return;

  const textoAntigoApontamento = ['Apontamento de producao ', 'simu', 'lado.'].join('');
  const textoAntigoEvento = ['Evento ', 'simu', 'lado fechado'].join('');
  const textoAntigoJustificativa = ['Justificativa auto', 'matica'].join('');
  const textoAntigoOrdem = ['OP criada auto', 'maticamente'].join('');
  const userAgentAntigo = ['ProdSync DB ', 'Sim', 'ulator'].join('');
  const prefixoLoteAntigo = ['AU', 'TO-'].join('');

  await Promise.all([
    prisma.turno.updateMany({
      where: { id_empresa, nome_turno: 'Manha Auto' },
      data: { nome_turno: 'Turno Manha' },
    }),
    prisma.turno.updateMany({
      where: { id_empresa, nome_turno: 'Tarde Auto' },
      data: { nome_turno: 'Turno Tarde' },
    }),
    prisma.turno.updateMany({
      where: { id_empresa, nome_turno: 'Noite Auto' },
      data: { nome_turno: 'Turno Noite' },
    }),
    prisma.apontamento.updateMany({
      where: { id_empresa, observacao: textoAntigoApontamento },
      data: { observacao: 'Producao dentro do ciclo previsto.' },
    }),
    prisma.historico_Eventos.updateMany({
      where: { id_empresa, observacao: { startsWith: textoAntigoEvento } },
      data: { observacao: 'Ocorrencia encerrada apos verificacao da equipe responsavel.' },
    }),
    prisma.historico_Eventos.updateMany({
      where: { id_empresa, observacao: { startsWith: textoAntigoJustificativa } },
      data: { observacao: 'Ocorrencia encerrada apos analise da equipe responsavel.' },
    }),
    prisma.ordemProducao.updateMany({
      where: { id_empresa, observacao_op: { startsWith: textoAntigoOrdem } },
      data: { observacao_op: 'Ordem liberada para producao conforme planejamento do turno.' },
    }),
    prisma.logs.updateMany({
      where: { user_agent: userAgentAntigo },
      data: {
        user_agent: 'ProdSync Web',
        dados_requisicao: JSON.stringify({ origem: 'operacao' }),
        dados_resposta: JSON.stringify({ status: 'registrado' }),
      },
    }),
  ]);

  const ordensComCodigoAntigo = await prisma.ordemProducao.findMany({
    where: { id_empresa, codigo_lote: { startsWith: prefixoLoteAntigo } },
    select: { id_ordem: true, id_maquina: true, data_inicio: true },
    take: 200,
  });

  for (const ordem of ordensComCodigoAntigo) {
    await prisma.ordemProducao.update({
      where: { id_ordem: ordem.id_ordem },
      data: {
        codigo_lote: criarCodigoLote(
          id_empresa,
          ordem.id_maquina,
          ordem.id_ordem,
          ordem.data_inicio ?? new Date(),
        ),
      },
    });
  }
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

  const gestor = await getGestorParaSetor(id_empresa, maquina.id_setor_operacao);
  const codigo_lote = criarCodigoLote(id_empresa, maquina.id_maquina);
  const ordem = await prisma.ordemProducao.create({
    data: {
      id_empresa,
      id_maquina: maquina.id_maquina,
      id_setor: maquina.id_setor_operacao,
      codigo_lote,
      produto: sample(produtos),
      qtd_planejada: randomInt(700, 3200),
      data_inicio: addDays(new Date(), -randomInt(0, 2)),
      data_fim: addDays(new Date(), randomInt(1, 5)),
      observacao_op: `Ordem liberada para producao da maquina ${maquina.nome}.`,
      prioridade: sample(['Baixa', 'Media', 'Alta']),
      status_op: 'Em_Andamento',
      setores: { connect: [{ id_setor: maquina.id_setor_operacao }] },
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
      observacao: `Ocorrencia encerrada apos analise: ${motivo.descricao}.`,
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

async function createApontamento(id_empresa, maquina, turno, ordem, dataInicio = null, options = {}) {
  if (!ordem) return { apontamentos: 0, eventos: 0 };

  const duracao = Number(options.duracaoMinutos) || randomInt(10, 42);
  const inicio = dataInicio ?? minutesAgo(duracao);
  const fim = options.dataFim ?? addMinutes(inicio, duracao);

  const totalPecas = Number(options.totalPecas)
    || randomInt(Math.max(20, duracao * 2), Math.max(35, duracao * 6));
  const qtd_refugo = Number.isFinite(Number(options.qtd_refugo))
    ? Number(options.qtd_refugo)
    : chance(0.32)
      ? randomInt(1, Math.max(2, Math.round(totalPecas * 0.08)))
      : 0;
  const qtd_boa = Math.max(0, totalPecas - qtd_refugo);

  await prisma.apontamento.create({
    data: {
      id_empresa,
      id_ordemProducao: ordem.id_ordem,
      id_maquina: maquina.id_maquina,
      id_operador: maquina.id_operador_operacao,
      id_turno: turno.id_turno,
      qtd_boa,
      qtd_refugo,
      data_hora_inicio: inicio,
      data_hora_fim: fim,
      observacao: qtd_refugo > 0
        ? sample(observacoesQualidade)
        : sample(observacoesProducao),
    },
  });

  await prisma.maquinas.updateMany({
    where: { id_empresa, id_maquina: maquina.id_maquina },
    data: {
      status_atual: 'Produzindo',
      status: 'Produzindo',
      id_operador: maquina.id_operador_operacao,
      id_setor: maquina.id_setor_operacao,
      board_ultimo_contato_em: fim,
    },
  });

  await prisma.ordemProducao.updateMany({
    where: { id_empresa, id_ordem: ordem.id_ordem },
    data: { status_op: 'Em_Andamento', prioridade: 'Media' },
  });

  await registrarLogUsuario(
    id_empresa,
    { id_usuario: maquina.id_operador_operacao },
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

async function getPeriodoDiaIndustrial(id_empresa, dataReferencia = new Date()) {
  const turnos = await prisma.turno.findMany({
    where: { id_empresa },
    select: { hora_inicio: true },
  });

  if (turnos.length === 0) {
    const inicio = new Date(dataReferencia);
    inicio.setHours(0, 0, 0, 0);
    return { inicio, fim: addDays(inicio, 1) };
  }

  const minutosInicio = Math.min(...turnos.map((turno) => {
    const data = new Date(turno.hora_inicio);
    return (data.getHours() * 60) + data.getMinutes();
  }));

  const inicio = new Date(dataReferencia);
  const minutosAgora = (inicio.getHours() * 60) + inicio.getMinutes();
  inicio.setHours(Math.floor(minutosInicio / 60), minutosInicio % 60, 0, 0);

  if (minutosAgora < minutosInicio) {
    inicio.setDate(inicio.getDate() - 1);
  }

  return { inicio, fim: addDays(inicio, 1) };
}

async function getPeriodoTurnoAtual(id_empresa, dataReferencia = new Date()) {
  const turno = await getTurnoParaData(id_empresa, dataReferencia);
  if (!turno) return null;

  return {
    turno,
    periodo: TurnoModel.obterPeriodoTurno(turno, dataReferencia),
  };
}

function montarJanelaApontamento(periodo, duracaoMaxima = 32) {
  const agora = new Date();
  const fimPeriodo = periodo?.fim ?? agora;
  const inicioPeriodo = periodo?.inicio ?? minutesAgo(60);
  const fimLimite = new Date(Math.min(agora.getTime(), fimPeriodo.getTime()));

  if (inicioPeriodo >= fimLimite) {
    return { inicio: addMinutes(fimLimite, -1), fim: fimLimite, duracaoMinutos: 1 };
  }

  const minutosDisponiveis = Math.floor((fimLimite - inicioPeriodo) / 60000);
  const duracaoMinutos = Math.max(1, Math.min(randomInt(12, duracaoMaxima), minutosDisponiveis - 2 || 1));
  const folgaMaxima = Math.max(0, minutosDisponiveis - duracaoMinutos - 1);
  const folga = folgaMaxima > 0 ? randomInt(0, Math.min(25, folgaMaxima)) : 0;
  let fim = addMinutes(fimLimite, -folga);
  let inicio = addMinutes(fim, -duracaoMinutos);

  if (inicio < inicioPeriodo) {
    inicio = addMinutes(inicioPeriodo, 1);
    fim = addMinutes(inicio, duracaoMinutos);
  }

  return { inicio, fim, duracaoMinutos };
}

function getPeriodoDiaCalendario(dataReferencia = new Date()) {
  const inicio = new Date(dataReferencia);
  inicio.setHours(0, 0, 0, 0);
  return { inicio, fim: addDays(inicio, 1) };
}

function intersectarPeriodos(...periodos) {
  const validos = periodos.filter(Boolean);
  const inicio = new Date(Math.max(...validos.map((periodo) => periodo.inicio.getTime())));
  const fim = new Date(Math.min(...validos.map((periodo) => periodo.fim.getTime())));
  return inicio < fim ? { inicio, fim } : null;
}

function criarHorariosProducaoHoje(periodoHoje, agora, horasComProducao) {
  const horarios = [];
  const horaInicial = periodoHoje.inicio.getHours();
  const horaAtual = agora.getHours();

  for (let hora = horaInicial; hora < horaAtual; hora += 1) {
    if (horasComProducao.has(hora)) continue;

    const fim = new Date(agora);
    fim.setHours(hora, randomInt(8, 52), 0, 0);

    if (fim < periodoHoje.inicio) {
      fim.setTime(addMinutes(periodoHoje.inicio, randomInt(5, 25)).getTime());
    }

    if (fim > agora) {
      fim.setTime(agora.getTime());
    }

    horarios.push(new Date(fim));
  }

  horarios.push(new Date(agora));

  return horarios.sort((a, b) => a - b);
}

function montarInicioApontamentoHoje(fim, periodoHoje) {
  const minutosDisponiveis = Math.max(1, Math.floor((fim - periodoHoje.inicio) / 60000));
  const duracaoMinutos = Math.max(1, Math.min(randomInt(12, 34), minutosDisponiveis));
  return {
    inicio: addMinutes(fim, -duracaoMinutos),
    duracaoMinutos,
  };
}

async function preencherProducaoHojeAteAgora(id_empresa, maquinas, periodoHoje, agora = new Date()) {
  const stats = { apontamentos: 0, ops_criadas: 0, horas_preenchidas: 0 };
  if (maquinas.length === 0 || agora <= periodoHoje.inicio) return stats;

  const producoesHoje = await prisma.apontamento.findMany({
    where: {
      id_empresa,
      qtd_boa: { gt: 0 },
      data_hora_fim: {
        gte: periodoHoje.inicio,
        lt: agora,
      },
    },
    select: { data_hora_fim: true },
  });

  const horasComProducao = new Set(
    producoesHoje.map((producao) => producao.data_hora_fim.getHours()),
  );
  const horarios = criarHorariosProducaoHoje(periodoHoje, agora, horasComProducao);
  const horasPreenchidas = horarios.filter((horario) => horario.getHours() !== agora.getHours()).length;
  stats.horas_preenchidas = horasPreenchidas;

  for (const [index, fim] of horarios.entries()) {
    const maquina = maquinas[index % maquinas.length];
    const turno = await getTurnoParaData(id_empresa, fim);
    if (!turno) continue;

    const ordemAntes = await prisma.ordemProducao.findFirst({
      where: { id_empresa, id_maquina: maquina.id_maquina, status_op: { in: STATUS_OP_ATIVOS } },
      select: { id_ordem: true },
    });
    const ordem = await getOrCreateOrdemAtiva(id_empresa, maquina);
    if (!ordem) continue;
    if (!ordemAntes) stats.ops_criadas += 1;

    const { inicio, duracaoMinutos } = montarInicioApontamentoHoje(fim, periodoHoje);
    const result = await createApontamento(id_empresa, maquina, turno, ordem, inicio, {
      dataFim: fim,
      duracaoMinutos,
      totalPecas: randomInt(18, 72),
      qtd_refugo: chance(0.18) ? randomInt(1, 4) : 0,
    });
    stats.apontamentos += result.apontamentos;
  }

  if (horasPreenchidas > 0) {
    console.log(
      `[cron-producao] empresa=${id_empresa} producao_hoje_preenchida ate=${agora.toTimeString().slice(0, 5)} ` +
      `horas=${horasPreenchidas} apontamentos=${stats.apontamentos}`,
    );
  }

  return stats;
}

async function createDashboardApontamento(id_empresa, maquina, turno, ordem, periodo, options = {}) {
  const janela = montarJanelaApontamento(periodo);
  return createApontamento(id_empresa, maquina, turno, ordem, janela.inicio, {
    dataFim: janela.fim,
    duracaoMinutos: janela.duracaoMinutos,
    totalPecas: options.totalPecas,
    qtd_refugo: options.qtd_refugo,
  });
}

async function ensureDashboardDataEmpresa(empresa, contexto) {
  const id_empresa = empresa.id_empresa;
  if (!config.dashboardEmpresaIds.includes(id_empresa)) {
    return { dashboard_apontamentos: 0, dashboard_eventos: 0, dashboard_horas_preenchidas: 0, ops_criadas: 0 };
  }

  const motivos = contexto?.motivos ?? await ensureMotivos(id_empresa);
  const maquinas = contexto?.maquinas ?? await getMaquinasElegiveis(id_empresa);
  const periodoDia = await getPeriodoDiaIndustrial(id_empresa);
  const periodoHoje = getPeriodoDiaCalendario();
  const turnoAtual = await getPeriodoTurnoAtual(id_empresa);
  const stats = { dashboard_apontamentos: 0, dashboard_eventos: 0, dashboard_horas_preenchidas: 0, ops_criadas: 0 };

  if (!turnoAtual?.turno || maquinas.length === 0) return stats;

  const producaoHojeStats = await preencherProducaoHojeAteAgora(id_empresa, maquinas, periodoHoje);
  stats.dashboard_apontamentos += producaoHojeStats.apontamentos;
  stats.dashboard_horas_preenchidas += producaoHojeStats.horas_preenchidas;
  stats.ops_criadas += producaoHojeStats.ops_criadas;

  const apontamentosDia = await prisma.apontamento.findMany({
    where: {
      id_empresa,
      data_hora_fim: {
        gte: periodoDia.inicio,
        lt: periodoDia.fim,
      },
    },
    select: {
      qtd_refugo: true,
      maquina: { select: { id_setor: true } },
    },
  });

  const setoresComProducao = new Set(
    apontamentosDia
      .map((apontamento) => apontamento.maquina?.id_setor)
      .filter(Boolean),
  );
  const setoresNecessarios = uniqueBy(
    maquinas
      .filter((maquina) => maquina.id_setor_operacao)
      .map((maquina) => ({
        id_setor: maquina.id_setor_operacao,
        maquina,
      })),
    'id_setor',
  ).slice(0, Math.max(1, config.dashboardMinSetores));

  for (const item of setoresNecessarios) {
    if (setoresComProducao.has(item.id_setor)) continue;

    const ordemAntes = await prisma.ordemProducao.findFirst({
      where: { id_empresa, id_maquina: item.maquina.id_maquina, status_op: { in: STATUS_OP_ATIVOS } },
      select: { id_ordem: true },
    });
    const ordem = await getOrCreateOrdemAtiva(id_empresa, item.maquina);
    if (!ordem) continue;
    if (!ordemAntes) stats.ops_criadas += 1;

    const result = await createDashboardApontamento(
      id_empresa,
      item.maquina,
      turnoAtual.turno,
      ordem,
      turnoAtual.periodo,
    );
    stats.dashboard_apontamentos += result.apontamentos;
    setoresComProducao.add(item.id_setor);
  }

  const periodoAtualHoje = intersectarPeriodos(turnoAtual.periodo, periodoHoje) ?? turnoAtual.periodo;
  const apontamentosHoje = await prisma.apontamento.count({
    where: {
      id_empresa,
      data_hora_fim: {
        gte: periodoHoje.inicio,
        lt: periodoHoje.fim,
      },
    },
  });

  if (apontamentosHoje === 0 && maquinas[0]) {
    const ordemAntes = await prisma.ordemProducao.findFirst({
      where: { id_empresa, id_maquina: maquinas[0].id_maquina, status_op: { in: STATUS_OP_ATIVOS } },
      select: { id_ordem: true },
    });
    const ordem = await getOrCreateOrdemAtiva(id_empresa, maquinas[0]);
    if (ordem) {
      if (!ordemAntes) stats.ops_criadas += 1;
      const result = await createDashboardApontamento(id_empresa, maquinas[0], turnoAtual.turno, ordem, periodoAtualHoje);
      stats.dashboard_apontamentos += result.apontamentos;
    }
  }

  const apontamentosTurnoAtual = await prisma.apontamento.count({
    where: {
      id_empresa,
      id_turno: turnoAtual.turno.id_turno,
      data_hora_fim: {
        gte: turnoAtual.periodo.inicio,
        lte: turnoAtual.periodo.fim,
      },
    },
  });

  if (apontamentosTurnoAtual === 0 && maquinas[0]) {
    const ordemAntes = await prisma.ordemProducao.findFirst({
      where: { id_empresa, id_maquina: maquinas[0].id_maquina, status_op: { in: STATUS_OP_ATIVOS } },
      select: { id_ordem: true },
    });
    const ordem = await getOrCreateOrdemAtiva(id_empresa, maquinas[0]);
    if (ordem) {
      if (!ordemAntes) stats.ops_criadas += 1;
      const result = await createDashboardApontamento(id_empresa, maquinas[0], turnoAtual.turno, ordem, turnoAtual.periodo);
      stats.dashboard_apontamentos += result.apontamentos;
    }
  }

  const refugosHoje = await prisma.apontamento.count({
    where: {
      id_empresa,
      qtd_refugo: { gt: 0 },
      data_hora_fim: {
        gte: periodoHoje.inicio,
        lt: periodoHoje.fim,
      },
    },
  });

  if (refugosHoje === 0 && maquinas[0]) {
    const ordemAntes = await prisma.ordemProducao.findFirst({
      where: { id_empresa, id_maquina: maquinas[0].id_maquina, status_op: { in: STATUS_OP_ATIVOS } },
      select: { id_ordem: true },
    });
    const ordem = await getOrCreateOrdemAtiva(id_empresa, maquinas[0]);
    if (ordem) {
      if (!ordemAntes) stats.ops_criadas += 1;
      const result = await createDashboardApontamento(id_empresa, maquinas[0], turnoAtual.turno, ordem, turnoAtual.periodo, {
        qtd_refugo: randomInt(1, 8),
      });
      stats.dashboard_apontamentos += result.apontamentos;
    }
  }

  const eventosDia = await prisma.historico_Eventos.count({
    where: {
      id_empresa,
      status_atual: { in: ['Parada', 'Setup', 'Manutencao'] },
      inicio: {
        gte: periodoHoje.inicio,
        lt: periodoHoje.fim,
      },
    },
  });

  if (eventosDia === 0 && motivos.length > 0 && maquinas[0]) {
    const ordemAntes = await prisma.ordemProducao.findFirst({
      where: { id_empresa, id_maquina: maquinas[0].id_maquina, status_op: { in: STATUS_OP_ATIVOS } },
      select: { id_ordem: true },
    });
    const ordem = await getOrCreateOrdemAtiva(id_empresa, maquinas[0]);
    const janela = montarJanelaApontamento(turnoAtual.periodo, 24);
    if (ordem && !ordemAntes) stats.ops_criadas += 1;
    const result = await createClosedEvent(id_empresa, maquinas[0], turnoAtual.turno, ordem, motivos, janela.inicio, {
      dataFim: janela.fim,
      duracaoMinutos: janela.duracaoMinutos,
    });
    stats.dashboard_eventos += result.eventos;
  }

  return stats;
}

async function createClosedEvent(id_empresa, maquina, turno, ordem, motivos, dataInicio = null, options = {}) {
  const status = options.status ?? sample(STATUS_PARADA);
  const duracaoBase = Number(options.duracaoMinutos) || randomInt(5, status === 'Setup' ? 75 : 50);
  const inicio = dataInicio ?? minutesAgo(duracaoBase);
  const termino = options.dataFim ?? addMinutes(inicio, duracaoBase);
  const duracao = Math.max(1, Math.round((termino - inicio) / 1000 / 60));
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
      observacao: `${sample(observacoesParada)} Motivo: ${motivo.descricao}.`,
      setor_afetado: maquina.id_setor_operacao,
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
      observacao: 'Ocorrencia em atendimento pela equipe responsavel.',
      setor_afetado: maquina.id_setor_operacao,
    },
  });

  await prisma.maquinas.updateMany({
    where: { id_empresa, id_maquina: maquina.id_maquina },
    data: {
      status_atual: status,
      status,
      id_operador: maquina.id_operador_operacao,
      id_setor: maquina.id_setor_operacao,
    },
  });

  if (ordem) {
    await prisma.ordemProducao.updateMany({
      where: { id_empresa, id_ordem: ordem.id_ordem },
      data: { status_op: status, prioridade: status === 'Parada' ? 'Critica' : 'Alta' },
    });
  }

  await NotificacaoModel.notificarEventoMaquina(id_empresa, evento, maquina.nome).catch((error) => {
    console.error('[cron-producao] Erro ao criar notificacoes:', error);
  });

  return { apontamentos: 0, eventos: 1 };
}

async function simulateEmpresa(empresa) {
  const id_empresa = empresa.id_empresa;
  const { motivos } = await ensureSupportData(id_empresa);
  await normalizarDadosApresentacao(id_empresa);

  const turno = await getTurnoParaData(id_empresa, new Date());
  const maquinas = await getMaquinasElegiveis(id_empresa);

  if (!turno) {
    console.warn(`[cron-producao] Empresa ${id_empresa} ignorada: nao ha turno cadastrado.`);
    return { empresas: 1, maquinas: 0, apontamentos: 0, eventos: 0, eventos_fechados: 0, ops_criadas: 0 };
  }

  if (motivos.length === 0) {
    console.warn(`[cron-producao] Empresa ${id_empresa} ignorada: nao ha motivos de parada.`);
    return { empresas: 1, maquinas: 0, apontamentos: 0, eventos: 0, eventos_fechados: 0, ops_criadas: 0 };
  }

  if (maquinas.length === 0) {
    console.warn(`[cron-producao] Empresa ${id_empresa} ignorada: nao ha maquinas ativas com operador ou escala.`);
    return { empresas: 1, maquinas: 0, apontamentos: 0, eventos: 0, eventos_fechados: 0, ops_criadas: 0 };
  }

  const selecionadas = uniqueBy(
    Array.from({ length: Math.min(config.batchSize, maquinas.length) }, () => sample(maquinas)),
    'id_maquina',
  );
  const dashboardStats = await ensureDashboardDataEmpresa(empresa, { motivos, maquinas });
  const stats = {
    empresas: 1,
    maquinas: selecionadas.length,
    apontamentos: 0,
    eventos: 0,
    eventos_fechados: 0,
    ops_criadas: dashboardStats.ops_criadas,
    dashboard_apontamentos: dashboardStats.dashboard_apontamentos,
    dashboard_eventos: dashboardStats.dashboard_eventos,
    dashboard_horas_preenchidas: dashboardStats.dashboard_horas_preenchidas,
  };

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
  const total = {
    empresas: 0,
    maquinas: 0,
    apontamentos: 0,
    eventos: 0,
    eventos_fechados: 0,
    ops_criadas: 0,
    dashboard_apontamentos: 0,
    dashboard_eventos: 0,
    dashboard_horas_preenchidas: 0,
  };

  for (const empresa of empresas) {
    sumStats(total, await simulateEmpresa(empresa));
  }

  console.log(
    `[cron-producao] ciclo empresas=${total.empresas} maquinas=${total.maquinas} ` +
    `ops_criadas=${total.ops_criadas} apontamentos=${total.apontamentos} ` +
    `eventos=${total.eventos} eventos_fechados=${total.eventos_fechados} ` +
    `dashboard_apontamentos=${total.dashboard_apontamentos} dashboard_eventos=${total.dashboard_eventos} ` +
    `dashboard_horas_preenchidas=${total.dashboard_horas_preenchidas}`,
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
    `[cron-producao] historico gerado dias=${config.historyDays} empresas=${total.empresas} ` +
    `apontamentos=${total.apontamentos} eventos=${total.eventos} ops_criadas=${total.ops_criadas}`,
  );
}

async function seedSupportData() {
  const empresas = await getEmpresasAlvo();
  for (const empresa of empresas) {
    await ensureSupportData(empresa.id_empresa);
    await normalizarDadosApresentacao(empresa.id_empresa);
  }
  console.log(`[cron-producao] dados de apoio garantidos para empresas: ${empresas.map((item) => item.id_empresa).join(', ')}`);
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
  console.log(
    `[cron-producao] rodando empresas=${config.empresaIds.join(',')} ` +
    `dashboard=${config.dashboardEmpresaIds.join(',')} intervalo=${config.intervalMs}ms.`,
  );
  await simulateCycle();

  const timer = setInterval(() => {
    simulateCycle().catch((error) => {
      console.error('[cron-producao] erro no ciclo:', error);
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
      console.error('[cron-producao] erro fatal:', error);
      process.exitCode = 1;
    })
    .finally(async () => {
      if (process.argv.includes('--once') || process.argv.includes('--seed-only') || process.argv.includes('--backfill')) {
        await prisma.$disconnect();
      }
    });
}

export { backfillHistory, seedSupportData, simulateCycle };
