import 'dotenv/config';
import bcrypt from 'bcrypt';
import prisma from '../config/prisma.js';
import { gerarIdUsuario } from '../dev-utils/gerarIdUsuario.js';

const PASSWORD = process.env.DEMO_SEED_PASSWORD || 'ProdSync@2026';
const HISTORY_DAYS = Number(process.env.DEMO_SEED_HISTORY_DAYS || 35);
const DIAS_SEMANA = ['Domingo', 'Segunda', 'Terca', 'Quarta', 'Quinta', 'Sexta', 'Sabado'];

const empresasSeed = [
  {
    nome_empresa: 'Metalurgica Aurora S.A.',
    cnpj: '12.483.671/0001-42',
    email: 'contato@metalurgicaaurora.com.br',
    telefone: '(11) 3456-7800',
    endereco: 'Av. Industrial Norte, 1480 - Campinas, SP',
    nome_representante: 'Helena Duarte',
    cpf_representante: '248.315.690-72',
    dominio: 'metalurgicaaurora.com.br',
    prefixoSerie: 'AUR',
  },
  {
    nome_empresa: 'Plasticos Horizonte Ltda.',
    cnpj: '31.706.925/0001-18',
    email: 'operacoes@plasticoshorizonte.com.br',
    telefone: '(41) 3388-4120',
    endereco: 'Rua das Industrias, 922 - Curitiba, PR',
    nome_representante: 'Marcos Vieira',
    cpf_representante: '517.284.903-64',
    dominio: 'plasticoshorizonte.com.br',
    prefixoSerie: 'HOR',
  },
  {
    nome_empresa: 'Usinagem Vale Norte Ltda.',
    cnpj: '46.219.804/0001-55',
    email: 'gestao@valenorteusinagem.com.br',
    telefone: '(31) 3721-9044',
    endereco: 'Rodovia MG-010, km 34 - Sete Lagoas, MG',
    nome_representante: 'Camila Rocha',
    cpf_representante: '693.051.427-89',
    dominio: 'valenorteusinagem.com.br',
    prefixoSerie: 'VAL',
  },
];

const setoresBase = [
  { nome_setor: 'Usinagem CNC', localizacao: 'Galpao A - corredor 1' },
  { nome_setor: 'Montagem Final', localizacao: 'Galpao A - celulas 4 a 8' },
  { nome_setor: 'Injecao e Moldagem', localizacao: 'Galpao B - area termica' },
  { nome_setor: 'Tratamento e Acabamento', localizacao: 'Galpao C - linha de acabamento' },
  { nome_setor: 'Controle de Qualidade', localizacao: 'Laboratorio dimensional' },
];

const categorias = [
  { nome: 'Centro de Usinagem', descricao: 'Equipamentos CNC para fresamento e acabamento dimensional.' },
  { nome: 'Torno CNC', descricao: 'Tornos de alta repetibilidade para eixos, buchas e flanges.' },
  { nome: 'Injetora Industrial', descricao: 'Celulas de injecao para componentes tecnicos.' },
  { nome: 'Prensa Hidraulica', descricao: 'Prensas para conformacao e ajuste de conjuntos.' },
  { nome: 'Celula de Montagem', descricao: 'Bancadas e dispositivos para montagem seriada.' },
  { nome: 'Inspecao Dimensional', descricao: 'Equipamentos de medicao e controle de qualidade.' },
];

const produtos = [
  'Conjunto de Engrenagens Helicoidais',
  'Eixo Cardan de Alta Resistencia',
  'Flange de Vedacao DN80',
  'Corpo de Valvula Hidraulica',
  'Suporte Estrutural Reforcado',
  'Bucha de Bronze Sinterizado',
  'Tampa Tecnica Injetada',
  'Carcaca de Redutor Industrial',
  'Painel de Fixacao Modular',
  'Anel de Retencao Usinado',
];

const motivosParada = [
  { descricao: 'Falta de material na linha', tipo: 'Nao_Programada' },
  { descricao: 'Troca programada de ferramenta', tipo: 'Programada' },
  { descricao: 'Setup de lote', tipo: 'Programada' },
  { descricao: 'Ajuste de sensor de presenca', tipo: 'Nao_Programada' },
  { descricao: 'Intervencao preventiva programada', tipo: 'Programada' },
  { descricao: 'Inspecao de qualidade adicional', tipo: 'Programada' },
  { descricao: 'Falha no alimentador automatico', tipo: 'Nao_Programada' },
  { descricao: 'Ajuste de pressao hidraulica', tipo: 'Nao_Programada' },
  { descricao: 'Aguardando liberacao da engenharia', tipo: 'Nao_Programada' },
  { descricao: 'Limpeza tecnica de dispositivo', tipo: 'Programada' },
];

const motivosRefugo = [
  'Dimensao fora da tolerancia',
  'Rebarba acima do padrao',
  'Trinca superficial detectada',
  'Acabamento irregular',
  'Furo desalinhado',
  'Deformacao no resfriamento',
  'Rosca incompleta',
];

const gestores = [
  'Helena Duarte',
  'Marcos Vieira',
  'Camila Rocha',
  'Renato Almeida',
  'Patricia Nogueira',
  'Bruno Carvalho',
  'Fernanda Lima',
  'Gustavo Martins',
  'Larissa Pires',
  'Eduardo Moreira',
  'Marina Castro',
  'Rafael Azevedo',
  'Bianca Torres',
  'Thiago Ramos',
  'Carolina Mendes',
];

const operadores = [
  'Anderson Silva',
  'Juliana Costa',
  'Felipe Andrade',
  'Roberta Martins',
  'Lucas Ferreira',
  'Aline Souza',
  'Diego Barbosa',
  'Priscila Gomes',
  'Mateus Ribeiro',
  'Vanessa Lopes',
  'Igor Santos',
  'Natalia Freitas',
  'Rafael Oliveira',
  'Mariana Teixeira',
  'Daniel Nunes',
  'Leticia Araujo',
  'Paulo Henrique',
  'Tatiane Moura',
  'Vinicius Lima',
  'Renata Siqueira',
  'Caio Farias',
  'Bruna Macedo',
  'Rodrigo Batista',
  'Simone Prado',
  'Leandro Cunha',
  'Elaine Campos',
  'Andre Pacheco',
  'Monica Reis',
  'Sergio Tavares',
  'Adriana Melo',
  'Murilo Neves',
  'Patricia Assis',
  'Fabio Castro',
  'Cristiane Dias',
  'Joao Barreto',
  'Luciana Vieira',
  'Elias Monteiro',
  'Paula Xavier',
  'Marcelo Matos',
  'Sabrina Cardoso',
  'Ricardo Lemos',
  'Talita Peixoto',
  'Cesar Afonso',
  'Daniela Brito',
  'Henrique Moraes',
];

const maquinasBase = [
  { nome: 'Centro CNC Romi D800', categoria: 'Centro de Usinagem', setorIndex: 0, capacidade: '120 pecas/dia' },
  { nome: 'Torno CNC Mazak QT200', categoria: 'Torno CNC', setorIndex: 0, capacidade: '160 pecas/dia' },
  { nome: 'Centro Horizontal Heller HF3500', categoria: 'Centro de Usinagem', setorIndex: 0, capacidade: '95 pecas/dia' },
  { nome: 'Celula de Montagem Atlas 01', categoria: 'Celula de Montagem', setorIndex: 1, capacidade: '240 conjuntos/dia' },
  { nome: 'Bancada Pneumatica Bosch M2', categoria: 'Celula de Montagem', setorIndex: 1, capacidade: '210 conjuntos/dia' },
  { nome: 'Prensa Hidraulica Schulz 80T', categoria: 'Prensa Hidraulica', setorIndex: 1, capacidade: '180 ciclos/dia' },
  { nome: 'Injetora Haitian 250T', categoria: 'Injetora Industrial', setorIndex: 2, capacidade: '320 pecas/dia' },
  { nome: 'Injetora Romi Primax 220R', categoria: 'Injetora Industrial', setorIndex: 2, capacidade: '300 pecas/dia' },
  { nome: 'Misturador Gravimetrico Piovan', categoria: 'Injetora Industrial', setorIndex: 2, capacidade: '18 lotes/dia' },
  { nome: 'Linha de Jateamento CMV 12', categoria: 'Prensa Hidraulica', setorIndex: 3, capacidade: '260 pecas/dia' },
  { nome: 'Cabine de Pintura WEG CP4', categoria: 'Celula de Montagem', setorIndex: 3, capacidade: '140 pecas/dia' },
  { nome: 'Forno de Cura Tecnoheat F2', categoria: 'Prensa Hidraulica', setorIndex: 3, capacidade: '22 lotes/dia' },
  { nome: 'Tridimensional Mitutoyo Crysta', categoria: 'Inspecao Dimensional', setorIndex: 4, capacidade: '190 medicoes/dia' },
  { nome: 'Projetor de Perfil Starrett', categoria: 'Inspecao Dimensional', setorIndex: 4, capacidade: '230 medicoes/dia' },
  { nome: 'Bancada de Ensaios Hidraulicos', categoria: 'Inspecao Dimensional', setorIndex: 4, capacidade: '75 ensaios/dia' },
];

const imagensMaquinas = [
  'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1565793298595-6a879b1d9492?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1581092162384-8987c1d64718?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1581091215367-59ab6b4f71fb?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=900&q=80',
];

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const sample = (items) => items[randomInt(0, items.length - 1)];
const chance = (probability) => Math.random() < probability;

function slug(value) {
  return String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '.')
    .replace(/(^\.|\.$)/g, '');
}

function avatarUrl(nome) {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(nome)}&background=1d4ed8&color=fff&bold=true`;
}

function cpfSequencial(base) {
  const raw = String(80000000000 + base).padStart(11, '0').slice(-11);
  return `${raw.slice(0, 3)}.${raw.slice(3, 6)}.${raw.slice(6, 9)}-${raw.slice(9)}`;
}

function timeOnly(hours, minutes = 0) {
  return new Date(Date.UTC(1970, 0, 1, hours, minutes, 0, 0));
}

function addDays(date, days) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function addMinutes(date, minutes) {
  return new Date(date.getTime() + minutes * 60 * 1000);
}

function startOfDay(date) {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
}

function atTime(date, hour, minute = 0) {
  const next = new Date(date);
  next.setHours(hour, minute, 0, 0);
  return next;
}

function turnoParaData(turnos, data, shiftIndex, setorId = null) {
  const dia_semana = DIAS_SEMANA[data.getDay()];
  const nomes = ['Manha', 'Tarde', 'Noite'];
  return turnos.find((turno) =>
    turno.dia_semana === dia_semana &&
    turno.nome_turno.startsWith(nomes[shiftIndex]) &&
    (!setorId || turno.id_setor === setorId)
  )
    ?? turnos.find((turno) => turno.dia_semana === dia_semana && turno.nome_turno.startsWith(nomes[shiftIndex]))
    ?? turnos.find((turno) => turno.dia_semana === dia_semana)
    ?? turnos[0];
}

function shiftStartHour(shiftIndex) {
  return [6, 14, 22][shiftIndex] ?? 6;
}

function shiftIndexAtual(data = new Date()) {
  const hora = data.getHours();
  if (hora >= 6 && hora < 14) return 0;
  if (hora >= 14 && hora < 22) return 1;
  return 2;
}

function inicioTurnoAtual(data = new Date()) {
  const shiftIndex = shiftIndexAtual(data);
  const inicio = atTime(data, shiftStartHour(shiftIndex), 0);

  if (shiftIndex === 2 && data.getHours() < 6) {
    inicio.setDate(inicio.getDate() - 1);
  }

  return inicio;
}

function statusAtualPorIndice(index) {
  const statuses = ['Produzindo', 'Produzindo', 'Produzindo', 'Parada', 'Setup'];
  return statuses[index % statuses.length];
}

async function carregarIdsUsuariosExistentes() {
  const usuarios = await prisma.usuarios.findMany({
    select: { id_usuario: true },
  });

  return new Set(usuarios.map((usuario) => usuario.id_usuario));
}

function criarGeradorIdUsuarioUnico(idsReservados) {
  return (tipo) => {
    for (let tentativa = 0; tentativa < 1000; tentativa++) {
      const id_usuario = gerarIdUsuario(tipo);

      if (!idsReservados.has(id_usuario)) {
        idsReservados.add(id_usuario);
        return id_usuario;
      }
    }

    throw new Error(`Nao foi possivel gerar um ID unico para usuario do tipo ${tipo}.`);
  };
}

async function resetDemoCompanies() {
  const cnpjs = empresasSeed.map((empresa) => empresa.cnpj);
  const existentes = await prisma.empresas.findMany({
    where: { cnpj: { in: cnpjs } },
    select: { id_empresa: true, nome_empresa: true, cnpj: true },
  });

  if (existentes.length === 0) return;

  console.log(`[seed] Removendo empresas de apresentacao ja existentes: ${existentes.map((e) => e.nome_empresa).join(', ')}`);
  await prisma.empresas.deleteMany({ where: { cnpj: { in: cnpjs } } });
}

async function criarEmpresa(empresaSeed) {
  const {
    dominio: _dominio,
    prefixoSerie: _prefixoSerie,
    ...empresaData
  } = empresaSeed;

  return prisma.empresas.create({ data: empresaData });
}

async function criarSetores(id_empresa) {
  await prisma.setores.createMany({
    data: setoresBase.map((setor) => ({ ...setor, id_empresa })),
  });
  return prisma.setores.findMany({ where: { id_empresa }, orderBy: { id_setor: 'asc' } });
}

async function criarCategorias(id_empresa) {
  await prisma.categoria_Maquina.createMany({
    data: categorias.map((categoria) => ({ ...categoria, id_empresa })),
  });
}

async function criarUsuarios(id_empresa, empresaSeed, empresaIndex, gerarIdUsuarioUnico, senhaHash) {
  const usuarios = [];
  const offset = empresaIndex * 100;

  usuarios.push({
    id_usuario: gerarIdUsuarioUnico('Adm'),
    id_empresa,
    nome: `Administracao ${empresaSeed.nome_empresa}`,
    tipo: 'Adm',
    cpf: cpfSequencial(offset + 1),
    email: `administracao@${empresaSeed.dominio}`,
    senha: senhaHash,
    imagem_perfil: avatarUrl(`Administracao ${empresaSeed.nome_empresa}`),
  });

  for (let i = 0; i < 5; i++) {
    const nome = gestores[empresaIndex * 5 + i];
    usuarios.push({
      id_usuario: gerarIdUsuarioUnico('Gestor'),
      id_empresa,
      nome,
      tipo: 'Gestor',
      cpf: cpfSequencial(offset + 10 + i),
      email: `${slug(nome)}@${empresaSeed.dominio}`,
      senha: senhaHash,
      imagem_perfil: avatarUrl(nome),
    });
  }

  for (let i = 0; i < 15; i++) {
    const nome = operadores[empresaIndex * 15 + i];
    usuarios.push({
      id_usuario: gerarIdUsuarioUnico('Operador'),
      id_empresa,
      nome,
      tipo: 'Operador',
      cpf: cpfSequencial(offset + 30 + i),
      email: `${slug(nome)}@${empresaSeed.dominio}`,
      senha: senhaHash,
      imagem_perfil: avatarUrl(nome),
    });
  }

  await prisma.usuarios.createMany({ data: usuarios });

  return {
    admins: usuarios.filter((u) => u.tipo === 'Adm'),
    gestores: usuarios.filter((u) => u.tipo === 'Gestor'),
    operadores: usuarios.filter((u) => u.tipo === 'Operador'),
  };
}

async function vincularGestores(id_empresa, setores, gestoresCriados) {
  await prisma.setor_Gestor.createMany({
    data: setores.map((setor, index) => ({
      id_empresa,
      id_setor: setor.id_setor,
      id_gestor: gestoresCriados[index].id_usuario,
    })),
  });
}

async function criarTurnos(id_empresa, setores) {
  const turnos = [];

  for (const setor of setores) {
    for (const dia_semana of DIAS_SEMANA) {
      turnos.push(
        { id_empresa, id_setor: setor.id_setor, dia_semana, nome_turno: 'Manha Operacional', hora_inicio: timeOnly(6), hora_fim: timeOnly(14) },
        { id_empresa, id_setor: setor.id_setor, dia_semana, nome_turno: 'Tarde Operacional', hora_inicio: timeOnly(14), hora_fim: timeOnly(22) },
        { id_empresa, id_setor: setor.id_setor, dia_semana, nome_turno: 'Noite Operacional', hora_inicio: timeOnly(22), hora_fim: timeOnly(6) },
      );
    }
  }

  await prisma.turno.createMany({ data: turnos });
  return prisma.turno.findMany({ where: { id_empresa }, orderBy: { id_turno: 'asc' } });
}

async function criarMotivos(id_empresa) {
  await prisma.motivos_Parada.createMany({
    data: motivosParada.map((motivo) => ({ ...motivo, id_empresa })),
  });
  return prisma.motivos_Parada.findMany({ where: { id_empresa }, orderBy: { id_motivo: 'asc' } });
}

async function criarMaquinas(id_empresa, empresaSeed, empresaIndex, setores, operadoresCriados) {
  const dataAquisicaoBase = addDays(new Date(), -900);
  const maquinasData = maquinasBase.map((maquina, index) => ({
    id_empresa,
    nome: maquina.nome,
    serie: `${empresaSeed.prefixoSerie}-${String(index + 1).padStart(3, '0')}`,
    status_atual: statusAtualPorIndice(index + empresaIndex),
    status: statusAtualPorIndice(index + empresaIndex),
    id_setor: setores[maquina.setorIndex].id_setor,
    data_ativacao: addDays(dataAquisicaoBase, index * 11),
    ativo: true,
    capacidade: maquina.capacidade,
    data_aquisicao: addDays(dataAquisicaoBase, -60 + index * 7),
    id_operador: operadoresCriados[index].id_usuario,
    imagem: imagensMaquinas[index % imagensMaquinas.length],
    categoria: maquina.categoria,
    board_uid: `${empresaSeed.prefixoSerie}-ESP32-${String(index + 1).padStart(3, '0')}`,
    board_sincronizado_em: addDays(new Date(), -randomInt(10, 90)),
    board_ultimo_contato_em: addMinutes(new Date(), -randomInt(3, 240)),
  }));

  await prisma.maquinas.createMany({ data: maquinasData });
  return prisma.maquinas.findMany({ where: { id_empresa }, orderBy: { id_maquina: 'asc' } });
}

async function criarEscalas(id_empresa, maquinas, operadoresCriados, turnos) {
  const escalas = [];

  maquinas.forEach((maquina, index) => {
    const operador = operadoresCriados[index];
    const shiftIndex = index % 3;

    for (const dia_semana of DIAS_SEMANA) {
      const turnoDoDia = turnos.find((item) =>
        item.dia_semana === dia_semana &&
        item.nome_turno.startsWith(['Manha', 'Tarde', 'Noite'][shiftIndex]) &&
        item.id_setor === maquina.id_setor
      );

      escalas.push({
        id_empresa,
        id_operador: operador.id_usuario,
        id_turno: turnoDoDia?.id_turno ?? turnos[0].id_turno,
        id_setor: maquina.id_setor,
        id_maquina: maquina.id_maquina,
      });
    }
  });

  await prisma.escalaTrabalho.createMany({ data: escalas });
}

async function criarOrdens(id_empresa, empresaSeed, setores, maquinas) {
  const ordens = [];
  const hoje = startOfDay(new Date());

  for (let i = 0; i < 30; i++) {
    const maquina = maquinas[i % maquinas.length];
    const produto = produtos[i % produtos.length];
    const inicio = addDays(hoje, -HISTORY_DAYS + i);
    const finalizada = i < 20;
    const status_op = finalizada
      ? 'Finalizada'
      : ['Em_Andamento', 'Parada', 'Setup'][i % 3];
    const atrasada = !finalizada && (i % 2 === 0 || status_op === 'Parada');
    const dataFim = finalizada
      ? addDays(inicio, randomInt(2, 8))
      : atrasada
        ? addDays(hoje, -randomInt(1, 6))
        : addDays(hoje, randomInt(1, 5));

    ordens.push(await prisma.ordemProducao.create({
      data: {
        id_empresa,
        id_maquina: maquina.id_maquina,
        codigo_lote: `${empresaSeed.prefixoSerie}-OP-${String(i + 1).padStart(4, '0')}`,
        produto,
        data_inicio: inicio,
        data_fim: dataFim,
        qtd_planejada: randomInt(650, 2600),
        id_setor: maquina.id_setor,
        observacao_op: `Producao de ${produto} para carteira industrial programada.`,
        prioridade: atrasada ? ['Alta', 'Critica'][i % 2] : ['Alta', 'Media', 'Baixa', 'Critica'][i % 4],
        status_op,
        setores: { connect: { id_setor: maquina.id_setor } },
      },
    }));
  }

  return ordens;
}

function ordemParaMaquina(ordens, maquina) {
  const candidatas = ordens.filter((ordem) => ordem.id_maquina === maquina.id_maquina);
  return candidatas.length > 0 ? sample(candidatas) : sample(ordens);
}

async function criarApontamentos(id_empresa, maquinas, operadoresCriados, turnos, ordens) {
  const apontamentos = [];
  const hoje = startOfDay(new Date());

  for (let dayOffset = HISTORY_DAYS; dayOffset >= 1; dayOffset--) {
    const dia = addDays(hoje, -dayOffset);
    const diaSemana = dia.getDay();
    if (diaSemana === 0) continue;

    maquinas.forEach((maquina, index) => {
      if (chance(0.08)) return;

      const operador = operadoresCriados[index];
      const shiftIndex = index % 3;
      const turno = turnoParaData(turnos, dia, shiftIndex, maquina.id_setor);
      const inicio = atTime(dia, shiftStartHour(shiftIndex), randomInt(0, 25));
      const fim = addMinutes(inicio, randomInt(260, 450));
      const ordem = ordemParaMaquina(ordens, maquina);
      const qtdBoa = randomInt(45, 240);
      const qtdRefugo = chance(0.68) ? randomInt(0, Math.max(1, Math.round(qtdBoa * 0.06))) : 0;

      apontamentos.push({
        id_empresa,
        id_ordemProducao: ordem.id_ordem,
        id_maquina: maquina.id_maquina,
        id_operador: operador.id_usuario,
        id_turno: turno.id_turno,
        qtd_boa: qtdBoa,
        qtd_refugo: qtdRefugo,
        data_hora_inicio: inicio,
        data_hora_fim: fim,
        observacao: qtdRefugo > 0 ? sample(motivosRefugo) : 'Producao conforme parametros liberados.',
      });
    });
  }

  for (let i = 0; i < apontamentos.length; i += 500) {
    await prisma.apontamento.createMany({ data: apontamentos.slice(i, i + 500) });
  }
}

async function criarApontamentosTurnoAtual(id_empresa, maquinas, operadoresCriados, turnos, ordens) {
  const agora = new Date();
  const shiftIndex = shiftIndexAtual(agora);
  const inicioTurno = inicioTurnoAtual(agora);
  const apontamentos = [];

  maquinas.forEach((maquina, index) => {
    if (index % 3 !== shiftIndex) return;

    const operador = operadoresCriados[index];
    const turno = turnoParaData(turnos, inicioTurno, shiftIndex, maquina.id_setor);
    const ordem = ordemParaMaquina(ordens, maquina);
    const fimPlanejado = addMinutes(agora, -randomInt(5, 20));
    const fim = fimPlanejado <= inicioTurno ? agora : fimPlanejado;
    let inicio = addMinutes(fim, -randomInt(45, 120));

    if (inicio < inicioTurno) {
      inicio = addMinutes(inicioTurno, randomInt(5, 20));
    }

    if (inicio >= fim) {
      inicio = addMinutes(fim, -15);
    }

    apontamentos.push({
      id_empresa,
      id_ordemProducao: ordem.id_ordem,
      id_maquina: maquina.id_maquina,
      id_operador: operador.id_usuario,
      id_turno: turno.id_turno,
      qtd_boa: randomInt(85, 260),
      qtd_refugo: randomInt(0, 8),
      data_hora_inicio: inicio,
      data_hora_fim: fim,
      observacao: 'Producao do turno atual registrada para acompanhamento em tempo real.',
    });
  });

  if (apontamentos.length > 0) {
    await prisma.apontamento.createMany({ data: apontamentos });
    await prisma.maquinas.updateMany({
      where: {
        id_empresa,
        id_maquina: { in: apontamentos.map((apontamento) => apontamento.id_maquina) },
      },
      data: {
        status_atual: 'Produzindo',
        status: 'Produzindo',
        board_ultimo_contato_em: agora,
      },
    });
  }
}

async function criarEventos(id_empresa, maquinas, turnos, motivos, ordens, gestoresCriados) {
  const hoje = startOfDay(new Date());
  const eventosCriados = [];

  for (let dayOffset = HISTORY_DAYS; dayOffset >= 1; dayOffset--) {
    const dia = addDays(hoje, -dayOffset);

    for (const [index, maquina] of maquinas.entries()) {
      if (!chance(dayOffset <= 7 ? 0.5 : 0.32)) continue;

      const shiftIndex = index % 3;
      const turno = turnoParaData(turnos, dia, shiftIndex, maquina.id_setor);
      const status_atual = chance(0.28) ? 'Setup' : 'Parada';
      const inicio = addMinutes(atTime(dia, shiftStartHour(shiftIndex), randomInt(20, 90)), randomInt(0, 240));
      const duracao = status_atual === 'Setup' ? randomInt(25, 130) : randomInt(12, 210);
      const termino = addMinutes(inicio, duracao);
      const motivo = status_atual === 'Setup'
        ? motivos.find((item) => item.descricao === 'Setup de lote') ?? sample(motivos)
        : sample(motivos);
      const ordem = ordemParaMaquina(ordens, maquina);

      eventosCriados.push(await prisma.historico_Eventos.create({
        data: {
          id_empresa,
          id_maquina: maquina.id_maquina,
          id_ordemProducao: ordem.id_ordem,
          id_turno: turno.id_turno,
          id_motivo_parada: motivo.id_motivo,
          status_atual,
          inicio,
          termino,
          duracao,
          observacao: `${motivo.descricao}. Registro acompanhado pela lideranca do setor.`,
          setor_afetado: maquina.id_setor ?? 0,
        },
      }));
    }
  }

  const maquinasComPendencia = maquinas.slice(0, 3);
  for (const [index, maquina] of maquinasComPendencia.entries()) {
    const inicio = addMinutes(new Date(), -randomInt(25, 160));
    const turno = turnoParaData(turnos, inicio, index % 3, maquina.id_setor);
    const ordem = ordemParaMaquina(ordens, maquina);
    const status_atual = index === 1 ? 'Setup' : 'Parada';
    const evento = await prisma.historico_Eventos.create({
      data: {
        id_empresa,
        id_maquina: maquina.id_maquina,
        id_ordemProducao: ordem.id_ordem,
        id_turno: turno.id_turno,
        id_motivo_parada: null,
        status_atual,
        inicio,
        termino: null,
        duracao: null,
        observacao: 'Evento aguardando justificativa operacional.',
        setor_afetado: maquina.id_setor ?? 0,
      },
    });
    eventosCriados.push(evento);

    await prisma.maquinas.updateMany({
      where: {
        id_empresa,
        id_maquina: maquina.id_maquina,
      },
      data: {
        status_atual,
        status: status_atual,
        board_ultimo_contato_em: inicio,
      },
    });

    await prisma.ordemProducao.update({
      where: { id_ordem: ordem.id_ordem },
      data: {
        status_op: status_atual,
        prioridade: status_atual === 'Parada' ? 'Critica' : 'Alta',
      },
    });

    const gestor = gestoresCriados[index % gestoresCriados.length];
    await prisma.notificacoes.create({
      data: {
        id_empresa,
        id_destinatario: gestor.id_usuario,
        tipo: status_atual === 'Setup' ? 'Maquina_Setup' : 'Maquina_Parada',
        titulo: `${maquina.nome} requer atencao`,
        mensagem: `${maquina.nome} registrou ${status_atual.toLowerCase()} e aguarda justificativa do responsavel.`,
        id_evento: evento.id_evento,
        id_maquina: maquina.id_maquina,
        lida: index === 2,
        lida_em: index === 2 ? addMinutes(new Date(), -15) : null,
        criado_em: addMinutes(new Date(), -randomInt(10, 120)),
      },
    });
  }

  return eventosCriados;
}

async function criarLogs(id_empresa, usuarios) {
  const rotas = [
    '/api/maquinas',
    '/api/eventos',
    '/api/ordens',
    '/api/dashboard/status',
    '/api/apontamentos',
  ];

  const logs = [];
  const hoje = new Date();
  for (const usuario of usuarios) {
    for (let i = 0; i < 5; i++) {
      logs.push({
        usuario_id: usuario.id_usuario,
        rota: sample(rotas),
        metodo: sample(['GET', 'GET', 'POST', 'PUT']),
        status_code: sample([200, 200, 200, 201, 204]),
        ip_address: `192.168.${randomInt(10, 80)}.${randomInt(10, 240)}`,
        user_agent: 'ProdSync Presentation Seed',
        tempo_resposta_ms: randomInt(60, 980),
        dados_requisicao: JSON.stringify({ origem: 'apresentacao', id_empresa }),
        dados_resposta: JSON.stringify({ sucesso: true }),
        criado_em: addMinutes(hoje, -randomInt(15, HISTORY_DAYS * 24 * 60)),
      });
    }
  }

  await prisma.logs.createMany({ data: logs });
}

async function popularEmpresa(empresaSeed, empresaIndex, gerarIdUsuarioUnico, senhaHash) {
  const empresa = await criarEmpresa(empresaSeed);
  const setores = await criarSetores(empresa.id_empresa);
  await criarCategorias(empresa.id_empresa);

  const usuariosCriados = await criarUsuarios(
    empresa.id_empresa,
    empresaSeed,
    empresaIndex,
    gerarIdUsuarioUnico,
    senhaHash
  );

  await vincularGestores(empresa.id_empresa, setores, usuariosCriados.gestores);
  const turnos = await criarTurnos(empresa.id_empresa, setores);
  const motivos = await criarMotivos(empresa.id_empresa);
  const maquinas = await criarMaquinas(
    empresa.id_empresa,
    empresaSeed,
    empresaIndex,
    setores,
    usuariosCriados.operadores
  );
  await criarEscalas(empresa.id_empresa, maquinas, usuariosCriados.operadores, turnos);
  const ordens = await criarOrdens(empresa.id_empresa, empresaSeed, setores, maquinas);
  await criarApontamentos(empresa.id_empresa, maquinas, usuariosCriados.operadores, turnos, ordens);
  await criarApontamentosTurnoAtual(empresa.id_empresa, maquinas, usuariosCriados.operadores, turnos, ordens);
  await criarEventos(empresa.id_empresa, maquinas, turnos, motivos, ordens, usuariosCriados.gestores);
  await criarLogs(empresa.id_empresa, [
    ...usuariosCriados.admins,
    ...usuariosCriados.gestores,
    ...usuariosCriados.operadores,
  ]);

  console.log(`[seed] ${empresa.nome_empresa}: ${setores.length} setores, ${maquinas.length} maquinas, ${usuariosCriados.operadores.length} operadores, ${ordens.length} OPs.`);

  return {
    empresa,
    usuarios: usuariosCriados,
  };
}

function imprimirUsuariosCriados(empresasPopuladas) {
  const grupos = [
    ['Adm', 'admins'],
    ['Gestor', 'gestores'],
    ['Operador', 'operadores'],
  ];

  console.log('[seed] Usuarios criados para acesso:');

  for (const [titulo, chave] of grupos) {
    console.log(`${titulo}:`);

    for (const item of empresasPopuladas) {
      for (const usuario of item.usuarios[chave]) {
        console.log(`${usuario.id_usuario} - Empresa ${item.empresa.id_empresa}`);
      }
    }
  }
}

async function main() {
  console.log('[seed] Iniciando carga de apresentacao do ProdSync...');
  await resetDemoCompanies();

  const senhaHash = await bcrypt.hash(PASSWORD, 10);
  const idsUsuariosExistentes = await carregarIdsUsuariosExistentes();
  const gerarIdUsuarioUnico = criarGeradorIdUsuarioUnico(idsUsuariosExistentes);
  const empresasPopuladas = [];

  for (let i = 0; i < empresasSeed.length; i++) {
    empresasPopuladas.push(await popularEmpresa(empresasSeed[i], i, gerarIdUsuarioUnico, senhaHash));
  }

  console.log('[seed] Carga finalizada com sucesso.');
  console.log(`[seed] Senha padrao dos usuarios criados: ${PASSWORD}`);
  imprimirUsuariosCriados(empresasPopuladas);
  console.log('[seed] Empresas criadas:');
  for (const empresa of empresasSeed) {
    console.log(`  - ${empresa.nome_empresa} (${empresa.email})`);
  }
}

main()
  .catch((error) => {
    console.error('[seed] Falha ao popular banco de apresentacao:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
