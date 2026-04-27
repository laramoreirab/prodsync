// remover este arquivo e o USE_MOCK do service quando o backend estiver pronto

export let usuariosMock = [
  {
    id: 1,
    id_usuario: 1,
    nome: "Ana Silva",
    cpf: "12345678901",
    email: "ana.silva@empresa.com",
    id_setor: "1",
    funcao: "Operador",
    id_turno: "1",
    id_maquina: "1",
    imagem_perfil: null,
  },
  {
    id: 2,
    id_usuario: 2,
    nome: "Carlos Souza",
    cpf: "23456789012",
    email: "carlos.souza@empresa.com",
    id_setor: "2",
    funcao: "Gestor",
    id_turno: "2",
    id_maquina: "2",
    imagem_perfil: null,
  },
  {
    id: 3,
    id_usuario: 3,
    nome: "Bruno Costa",
    cpf: "34567890123",
    email: "bruno.costa@empresa.com",
    id_setor: "1",
    funcao: "Operador",
    id_turno: "3",
    id_maquina: "1",
    imagem_perfil: null,
  },
  {
    id: 4,
    id_usuario: 4,
    nome: "Bia Gonçalves",
    cpf: "45678901234",
    email: "bia.goncalves@empresa.com",
    id_setor: "2",
    funcao: "Gestor",
    id_turno: "2",
    id_maquina: "3",
    imagem_perfil: null,
  },
  {
    id: 5,
    id_usuario: 5,
    nome: "Felipe Martins",
    cpf: "56789012345",
    email: "felipe.martins@empresa.com",
    id_setor: "1",
    funcao: "Operador",
    id_turno: "1",
    id_maquina: "2",
    imagem_perfil: null,
  },
];

let proximoId = 6;

// Simula delay de rede
const delay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms));

export const usuariosMockService = {
  getAll: async () => {
    await delay();
    return [...usuariosMock];
  },

  getById: async (id) => {
    await delay();
    const usuario = usuariosMock.find((u) => u.id === Number(id));
    if (!usuario) throw new Error("Usuário não encontrado");
    return { ...usuario };
  },

  create: async (formData) => {
    await delay();
    const novo = {
      id: proximoId,
      id_usuario: proximoId++,
      nome: formData.get("nome"),
      cpf: formData.get("cpf"),
      email: formData.get("email"),
      id_setor: formData.get("id_setor"),
      funcao: formData.get("funcao"),
      id_turno: formData.get("id_turno"),
      id_maquina: formData.get("id_maquina"),
      imagem_perfil: null,
    };
    usuariosMock.push(novo);
    return { ...novo };
  },

  update: async (id, formData) => {
    await delay();
    const index = usuariosMock.findIndex((u) => u.id === Number(id));
    if (index === -1) throw new Error("Usuário não encontrado");

    usuariosMock[index] = {
      ...usuariosMock[index],
      nome: formData.get("nome") ?? usuariosMock[index].nome,
      cpf: formData.get("cpf") ?? usuariosMock[index].cpf,
      email: formData.get("email") ?? usuariosMock[index].email,
      id_setor: formData.get("id_setor") ?? usuariosMock[index].id_setor,
      funcao: formData.get("funcao") ?? usuariosMock[index].funcao,
      id_turno: formData.get("id_turno") ?? usuariosMock[index].id_turno,
      id_maquina: formData.get("id_maquina") ?? usuariosMock[index].id_maquina,
    };

    return { ...usuariosMock[index] };
  },

  delete: async (id) => {
    await delay();
    const index = usuariosMock.findIndex((u) => u.id === Number(id));
    if (index === -1) throw new Error("Usuário não encontrado");
    usuariosMock.splice(index, 1);
    return true;
  },
};