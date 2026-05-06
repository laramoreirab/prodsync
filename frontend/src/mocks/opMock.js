// src/mocks/opMock.js
// Remova este arquivo e o USE_MOCK do service quando o backend estiver pronto

export let opMock = [
  {
    id: 1,
    id_ordem: 1,
    prioridade: "Crítica",
    codigo_lote: "LOTE-001",
    id_setor: 1,
    setor: "Roscas",
    id_maquina: 1,
    maquina: "Torno CNC Alpha",
    qtd_planejada: 500,
    produto: "Rosca M10",
    data_inicio: "2024-03-01T08:00:00.000Z",
    data_fim: "2024-03-05T17:00:00.000Z",
    observacao_op: "Refugo máximo tolerado: 2%",
    status_op: "Produzindo",
    progresso: 25,
  },
  {
    id: 2,
    id_ordem: 2,
    prioridade: "Alta",
    codigo_lote: "LOTE-002",
    id_setor: 2,
    setor: "Engrenagens",
    id_maquina: 2,
    maquina: "Fresadora Beta",
    qtd_planejada: 300,
    produto: "Engrenagem Z32",
    data_inicio: "2024-03-02T08:00:00.000Z",
    data_fim: "2024-03-06T17:00:00.000Z",
    observacao_op: "",
    status_op: "Setup",
    progresso: 35,
  },
  {
    id: 3,
    id_ordem: 3,
    prioridade: "Média",
    codigo_lote: "LOTE-003",
    id_setor: 1,
    setor: "Roscas",
    id_maquina: 3,
    maquina: "Retificadora Gama",
    qtd_planejada: 200,
    produto: "Rosca M8",
    data_inicio: "2024-03-03T08:00:00.000Z",
    data_fim: "2024-03-07T17:00:00.000Z",
    observacao_op: "",
    status_op: "Parada",
    progresso: 55,
  },
  {
    id: 4,
    id_ordem: 4,
    prioridade: "Baixa",
    codigo_lote: "LOTE-004",
    id_setor: 2,
    setor: "Engrenagens",
    id_maquina: 4,
    maquina: "Mandriladora Delta",
    qtd_planejada: 150,
    produto: "Engrenagem Z16",
    data_inicio: "2024-03-04T08:00:00.000Z",
    data_fim: "2024-03-08T17:00:00.000Z",
    observacao_op: "",
    status_op: "Concluída",
    progresso: 100,
  },
  {
    id: 5,
    id_ordem: 5,
    prioridade: "Baixa",
    codigo_lote: "LOTE-005",
    id_setor: 1,
    setor: "Roscas",
    id_maquina: 5,
    maquina: "Torno CNC Épsilon",
    qtd_planejada: 400,
    produto: "Rosca M12",
    data_inicio: "2024-03-05T08:00:00.000Z",
    data_fim: "2024-03-09T17:00:00.000Z",
    observacao_op: "",
    status_op: "Aguardando",
    progresso: 0,
  },
];

let proximoId = 6;

// Simula delay de rede
const delay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms));

export const opMockService = {
  getAll: async () => {
    await delay();
    return [...opMock];
  },

  getById: async (id) => {
    await delay();
    const op = opMock.find((o) => o.id === Number(id));
    if (!op) throw new Error("Ordem de produção não encontrada");
    return { ...op };
  },

  // Criar nova OP
  // campos: prioridade, codigo_lote, id_setor, id_maquina, qtd_planejada, produto, data_inicio, data_fim, observacao_op
  create: async (dados) => {
    await delay();
    const nova = {
      id: proximoId,
      id_ordem: proximoId++,
      prioridade: dados.prioridade,
      codigo_lote: dados.codigo_lote,
      id_setor: dados.id_setor,
      setor: dados.id_setor === 1 ? "Roscas" : "Engrenagens",
      id_maquina: dados.id_maquina,
      maquina: `Máquina ${dados.id_maquina}`,
      qtd_planejada: dados.qtd_planejada,
      produto: dados.produto,
      data_inicio: dados.data_inicio,
      data_fim: dados.data_fim,
      observacao_op: dados.observacao_op || "",
      status_op: "Aguardando",
      progresso: 0,
    };
    opMock.push(nova);
    return { ...nova };
  },

  // Atualizar OP
  // campos: id_ordem + prioridade, codigo_lote, id_setor, id_maquina, qtd_planejada, produto, data_inicio, data_fim, observacao_op
  update: async (id, dados) => {
    await delay();
    const index = opMock.findIndex((o) => o.id === Number(id));
    if (index === -1) throw new Error("Ordem de produção não encontrada");

    opMock[index] = {
      ...opMock[index],
      prioridade: dados.prioridade ?? opMock[index].prioridade,
      codigo_lote: dados.codigo_lote ?? opMock[index].codigo_lote,
      id_setor: dados.id_setor ?? opMock[index].id_setor,
      id_maquina: dados.id_maquina ?? opMock[index].id_maquina,
      qtd_planejada: dados.qtd_planejada ?? opMock[index].qtd_planejada,
      produto: dados.produto ?? opMock[index].produto,
      data_inicio: dados.data_inicio ?? opMock[index].data_inicio,
      data_fim: dados.data_fim ?? opMock[index].data_fim,
      observacao_op: dados.observacao_op ?? opMock[index].observacao_op,
    };

    return { ...opMock[index] };
  },

  // Deletar OP — id_ordem e id_maquina no body
  delete: async (id) => {
    await delay();
    const index = opMock.findIndex((o) => o.id === Number(id));
    if (index === -1) throw new Error("Ordem de produção não encontrada");
    opMock.splice(index, 1);
    return true;
  },
};