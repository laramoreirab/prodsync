// Remova este arquivo e o USE_MOCK do service quando o backend estiver pronto

export let eventosMock = [
  {
    id: 1,
    maquina: "Máquina A",
    tipo: "Setup",
    status_maquina: "Setup",
    setor_afetado: "Roscas",
    maquinas: [1],
    inicio: "2024-03-26T14:08:00.000Z",
    fim: null, // evento ativo
    id_motivo_parada: 1,
    motivo: "Troca de Molde",
    observacao: "",
    data: "26/03 (14:08 - Ativo)",
    duracao: "20:08",
    justificada: true,
  },
  {
    id: 2,
    maquina: "Máquina B",
    tipo: "Parada",
    status_maquina: "Parada",
    setor_afetado: "Engrenagens",
    maquinas: [2],
    inicio: "2024-03-26T13:09:00.000Z",
    fim: "2024-03-26T13:40:00.000Z",
    id_motivo_parada: null,
    motivo: "Aguardando Justificativa",
    observacao: "",
    data: "26/03 (13:09 - 13:40)",
    duracao: "13:09",
    justificada: false,
  },
  {
    id: 3,
    maquina: "Máquina C",
    tipo: "Setup",
    status_maquina: "Setup",
    setor_afetado: "Roscas",
    maquinas: [3],
    inicio: "2024-03-26T06:30:00.000Z",
    fim: "2024-03-26T19:06:00.000Z",
    id_motivo_parada: 2,
    motivo: "Troca de Molde",
    observacao: "",
    data: "26/03 (06:30 - 19:06)",
    duracao: "06:30",
    justificada: true,
  },
  {
    id: 4,
    maquina: "Máquina D",
    tipo: "Parada",
    status_maquina: "Parada",
    setor_afetado: "Engrenagens",
    maquinas: [4],
    inicio: "2024-03-26T14:10:00.000Z",
    fim: "2024-03-26T14:45:00.000Z",
    id_motivo_parada: 3,
    motivo: "Falta de Material",
    observacao: "Aguardando reposição",
    data: "26/03 (14:10 - 14:45)",
    duracao: "00:35",
    justificada: true,
  },
  {
    id: 5,
    maquina: "Máquina E",
    tipo: "Setup",
    status_maquina: "Setup",
    setor_afetado: "Roscas",
    maquinas: [5],
    inicio: "2024-03-26T14:10:00.000Z",
    fim: "2024-03-26T14:45:00.000Z",
    id_motivo_parada: 4,
    motivo: "Limpeza",
    observacao: "",
    data: "26/03 (14:10 - 14:45)",
    duracao: "00:35",
    justificada: true,
  },
];

let proximoId = 6;

// Simula delay de rede
const delay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms));

export const eventosMockService = {
  getAll: async () => {
    await delay();
    return [...eventosMock];
  },

  getById: async (id) => {
  await delay();
  const evento = eventosMock.find((e) => e.id === Number(id));
  if (!evento) throw new Error("Evento não encontrado");
  return { ...evento };
},

  getJustificados: async () => {
    await delay();
    return eventosMock.filter((e) => e.justificada === true);
  },

  getNaoJustificados: async () => {
    await delay();
    return eventosMock.filter((e) => e.justificada === false);
  },

  // Registrar evento pelo sistema
  // campos: status_maquina, setor_afetado, maquinas (array), inicio, fim, id_motivo_parada, observacao
  create: async (dados) => {
    await delay();
    const novo = {
      id: proximoId++,
      maquina: `Máquina ${dados.maquinas?.[0] ?? '?'}`,
      tipo: dados.status_maquina,
      status_maquina: dados.status_maquina,
      setor_afetado: dados.setor_afetado,
      maquinas: dados.maquinas,
      inicio: dados.inicio,
      fim: dados.fim || null,
      id_motivo_parada: dados.id_motivo_parada || null,
      motivo: dados.id_motivo_parada ? "Motivo registrado" : "Aguardando Justificativa",
      observacao: dados.observacao || "",
      data: new Date().toLocaleDateString('pt-BR'),
      duracao: "-",
      justificada: !!dados.id_motivo_parada,
    };
    eventosMock.push(novo);
    return { ...novo };
  },

  // Justificar evento existente
  // campos: id_evento, id_motivo_parada, observacao
  justificar: async (dados) => {
    await delay();
    const index = eventosMock.findIndex((e) => e.id === Number(dados.id_evento));
    if (index === -1) throw new Error("Evento não encontrado");
    if (eventosMock[index].justificada) throw new Error("Evento já possui justificativa");

    eventosMock[index] = {
      ...eventosMock[index],
      id_motivo_parada: dados.id_motivo_parada,
      motivo: "Justificativa registrada",
      observacao: dados.observacao || "",
      justificada: true,
    };

    return { ...eventosMock[index] };
  },
};