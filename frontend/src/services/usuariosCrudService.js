import { usuariosMockService } from "@/mocks/usuariosMock";

// trocar para true p false quando o backend estiver pronto p integração!!
const USE_MOCK = true;

const API_URL = "/api/usuarios";

const apiService = {
  //buscar todos os usuários
  getAll: async () => {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("Erro ao buscar usuários");
    return await response.json();
  },

  //buscar detalhes de um usuário
  getById: async (id) => {
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) throw new Error("Erro ao buscar detalhes do usuário");
    return await response.json();
  },

  //criar
  create: async (dados) => {
    const options = { method: "POST" };
    if (dados instanceof FormData) {
      options.body = dados;
    } else {
      options.headers = { "Content-Type": "application/json" };
      options.body = JSON.stringify(dados);
    }
    const response = await fetch(API_URL, options);
    if (!response.ok) throw new Error("Erro ao criar usuário");
    return await response.json();
  },

  //atuzalizar
  update: async (id, dados) => {
    const options = { method: "PUT" };
    if (dados instanceof FormData) {
      // Garante que id_usuario está no FormData
      if (!dados.get("id_usuario")) dados.append("id_usuario", id);
      options.body = dados;
    } else {
      options.headers = { "Content-Type": "application/json" };
      options.body = JSON.stringify({ id_usuario: id, ...dados });
    }
    const response = await fetch(API_URL, options);
    if (!response.ok) throw new Error("Erro ao atualizar usuário");
    return await response.json();
  },

  //deletar
  delete: async (id) => {
    const response = await fetch(API_URL, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id_usuario: id }),
    });
    if (!response.ok) throw new Error("Erro ao excluir usuário");
    return true;
  },
};

//remover essa linha pós conexão com o backend e seguir as instruções no final do arquivo
export const usuariosCrudService = USE_MOCK ? usuariosMockService : apiService;
//após a conexão com o backend, remover o arquivo usuariosMock.js e o USE_MOCK do service
//além disso, coloque o que está dentro da const apiService dentro de:
//export const maquinaCrudService ={o que ta dentro de apiService aqui dentro}