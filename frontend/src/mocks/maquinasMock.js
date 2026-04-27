export let maquinasMock = [
  {
    id: 1,
    nome: "Torno CNC Alpha",
    id_setor: "1",
    id_categoria: "1",
    serie: "SN-001-2021",
    // campos pendentes pro backend adicionar:
    capacidade: "500 peças/h",
    status: "Produzindo",
    dataAquisicao: "2021-03-15T00:00:00.000Z",
    operador: "João",
    imagemUrl: null,
    data: "2024-01-10T00:00:00.000Z",
  },
  {
    id: 2,
    nome: "Fresadora Beta",
    id_setor: "2",
    id_categoria: "1",
    serie: "SN-002-2020",
    // campos pendentes pro backend adicionar:
    capacidade: "300 peças/h",
    status: "Parada",
    dataAquisicao: "2020-07-22T00:00:00.000Z",
    operador: "João",
    imagemUrl: null,
    data: "2024-02-05T00:00:00.000Z",
  },
  {
    id: 3,
    nome: "Retificadora Gama",
    id_setor: "1",
    id_categoria: "1",
    serie: "SN-003-2019",
    // campos pendentes pro backend adicionar:
    capacidade: "200 peças/h",
    status: "Setup",
    dataAquisicao: "2019-11-30T00:00:00.000Z",
    operador: "João",
    imagemUrl: null,
    data: "2024-03-18T00:00:00.000Z",
  },
  {
    id: 4,
    nome: "Mandriladora Delta",
    id_setor: "2",
    id_categoria: "1",
    serie: "SN-004-2022",
    // campos pendentes pro backend adicionar:
    capacidade: "150 peças/h",
    status: "Produzindo",
    dataAquisicao: "2022-01-10T00:00:00.000Z",
    operador: "João",
    imagemUrl: null,
    data: "2024-04-01T00:00:00.000Z",
  },
  {
    id: 5,
    nome: "Torno CNC Épsilon",
    id_setor: "1",
    id_categoria: "1",
    serie: "SN-005-2023",
    // campos pendentes pro backend adicionar:
    capacidade: "450 peças/h",
    status: "Parada",
    dataAquisicao: "2023-06-05T00:00:00.000Z",
    operador: "João",
    imagemUrl: null,
    data: "2024-05-12T00:00:00.000Z",
  },
];

let proximoId = 6;

// Simula delay de rede
const delay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms));

// Mapeia id_setor para nome legível (útil para exibir na tabela)
const setorNome = { "1": "Engrenagens", "2": "Roscas" };
const categoriaNome = { "1": "Tipo A" };

export const maquinasMockService = {
  getAll: async () => {
    await delay();
    return [...maquinasMock];
  },

  getById: async (id) => {
    await delay();
    const maquina = maquinasMock.find((m) => m.id === Number(id));
    if (!maquina) throw new Error("Máquina não encontrada");
    return { ...maquina };
  },

  create: async (formData) => {
    await delay();
    const nova = {
      id: proximoId++,
      nome: formData.get("nome"),
      id_setor: formData.get("id_setor"),
      id_categoria: formData.get("id_categoria"),
      serie: formData.get("serie"),
      // campos pendentes pro backend adicionar:
      capacidade: formData.get("capacidade"),
      status: formData.get("status"),
      dataAquisicao: formData.get("dataAquisicao"),
      operador: formData.get("operador"),
      imagemUrl: null,
      data: new Date().toISOString(),
    };
    maquinasMock.push(nova);
    return { ...nova };
  },

  update: async (id, formData) => {
    await delay();
    const index = maquinasMock.findIndex((m) => m.id === Number(id));
    if (index === -1) throw new Error("Máquina não encontrada");

    maquinasMock[index] = {
      ...maquinasMock[index],
      nome: formData.get("nome") ?? maquinasMock[index].nome,
      serie: formData.get("serie") ?? maquinasMock[index].serie,
      // campos pendentes pro backend adicionar:
      id_setor: formData.get("id_setor") ?? maquinasMock[index].id_setor,
      id_categoria: formData.get("id_categoria") ?? maquinasMock[index].id_categoria,
      capacidade: formData.get("capacidade") ?? maquinasMock[index].capacidade,
      status: formData.get("status") ?? maquinasMock[index].status,
      operador: formData.get("operador") ?? maquinasMock[index].operador,
    };

    return { ...maquinasMock[index] };
  },

  delete: async (id) => {
    await delay();
    const index = maquinasMock.findIndex((m) => m.id === Number(id));
    if (index === -1) throw new Error("Máquina não encontrada");
    maquinasMock.splice(index, 1);
    return true;
  },
};