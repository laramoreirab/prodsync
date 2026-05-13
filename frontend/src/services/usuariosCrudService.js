import { apiFetch } from "@/lib/api";

// trocar para true p false quando o backend estiver pronto p integração!!
const USE_MOCK = false;

const API_URL = "/api/usuarios";

// const apiService = {
  export const usuariosCrudService ={
  //buscar todos os usuários
  getAll: async () => {
    const options = { method: "GET"}
    return await apiFetch(`${API_URL}/`, options);
  },

  //buscar detalhes de um usuário
  getById: async (id) => {
    const options = { method: "GET"}
    const response = await apiFetch(`${API_URL}/${id}`, options);
    return response.dados || response;
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
    return await apiFetch(`${API_URL}/criar`, options);
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
    return await apiFetch(`${API_URL}/${id}/atualizar`, options);
  },

  //deletar
  delete: async (id) => {
    return await apiFetch(`${API_URL}/${id}/deletar`, {
      method: "DELETE"
    });
  },
};

//remover essa linha pós conexão com o backend e seguir as instruções no final do arquivo
// export const usuariosCrudService = USE_MOCK ? usuariosMockService : apiService;
//após a conexão com o backend, remover o arquivo usuariosMock.js e o USE_MOCK do service
//além disso, coloque o que está dentro da const apiService dentro de:
//export const usuariosCrudService ={o que ta dentro de apiService aqui dentro}
