// remover este arquivo e o USE_MOCK do service quando o backend estiver pronto

export let setorMock = [
  {
    id: 1,
    id_setor: 1,
    nome_setor: "Roscas",
    localizacao: "Galpão A - Corredor 1",
    gestor: "Luiz Mariz",
    id_gestor: 1,
    oee_medio: "76%",
    qtd_de_maquinas: 67,
    qtd_de_operadores: 60,
    ids_maquinas: [1, 2, 3],
  },
  {
    id: 2,
    id_setor: 2,
    nome_setor: "Engrenagens",
    localizacao: "Galpão B - Corredor 2",
    gestor: "Luiza Mariza",
    id_gestor: 2,
    oee_medio: "78%",
    qtd_de_maquinas: 60,
    qtd_de_operadores: 58,
    ids_maquinas: [4, 5],
  },
  {
    id: 3,
    id_setor: 3,
    nome_setor: "Brocas",
    localizacao: "Galpão C - Corredor 3",
    gestor: "Estevão Ferreira",
    id_gestor: 3,
    oee_medio: "77%",
    qtd_de_maquinas: 50,
    qtd_de_operadores: 34,
    ids_maquinas: [],
  },
];

let proximoId = 4;

// Simula delay de rede
const delay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms));

export const setorMockService = {
  getAll: async () => {
    await delay();
    return [...setorMock];
  },

  getById: async (id) => {
    await delay();
    const setor = setorMock.find((s) => s.id === Number(id));
    if (!setor) throw new Error("Setor não encontrado");
    return { ...setor };
  },

  // Criar setor
  // campos: nome_setor, localizacao
  create: async (dados) => {
    await delay();
    const novo = {
      id: proximoId,
      id_setor: proximoId++,
      nome_setor: dados.nome_setor,
      localizacao: dados.localizacao || null,
      gestor: "",
      id_gestor: null,
      oee_medio: "0%",
      qtd_de_maquinas: 0,
      qtd_de_operadores: 0,
      ids_maquinas: [],
    };
    setorMock.push(novo);
    return { ...novo };
  },

  // Atualizar setor — campos: nome_setor
  update: async (id, dados) => {
    await delay();
    const index = setorMock.findIndex((s) => s.id === Number(id));
    if (index === -1) throw new Error("Setor não encontrado");

    setorMock[index] = {
      ...setorMock[index],
      nome_setor: dados.nome_setor ?? setorMock[index].nome_setor,
    };

    return { ...setorMock[index] };
  },

  // Deletar setor
  delete: async (id) => {
    await delay();
    const index = setorMock.findIndex((s) => s.id === Number(id));
    if (index === -1) throw new Error("Setor não encontrado");
    setorMock.splice(index, 1);
    return true;
  },

  // Associar máquinas ao setor — ids_maquinas (array)
  associarMaquinas: async (id_setor, ids_maquinas) => {
    await delay();
    const index = setorMock.findIndex((s) => s.id === Number(id_setor));
    if (index === -1) throw new Error("Setor não encontrado");
    setorMock[index].ids_maquinas = ids_maquinas;
    setorMock[index].qtd_de_maquinas = ids_maquinas.length;
    return { ...setorMock[index] };
  },

  // Associar gestor ao setor — id_gestor
  associarGestor: async (id_setor, id_gestor) => {
    await delay();
    const index = setorMock.findIndex((s) => s.id === Number(id_setor));
    if (index === -1) throw new Error("Setor não encontrado");
    setorMock[index].id_gestor = id_gestor;
    return { ...setorMock[index] };
  },

  //associar operador ao steor
  associarOperadores: async (id_setor, ids_operadores) => {
    await delay();
    // salva no mock quando implementar
    return true;
  },
};