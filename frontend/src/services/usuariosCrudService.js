import { apiFetch } from "@/lib/api";

const API_URL = "/api/usuarios";

export const usuariosCrudService = {
  //buscar todos os usuários
  getAll: async () => {
    const options = { method: "GET"}
    return await apiFetch(`${API_URL}/`, options);
  },

  // Buscar detalhes de um usuário por id
  getById: async (id) => {
    const options = { method: "GET"}
    const response = await apiFetch(`${API_URL}/${id}`, options);
    return response.dados || response;
  },

  // Criar novo usuário (aceita FormData para upload de foto)
  create: async (dados) => {
    const options = { method: "POST" };
    if (dados instanceof FormData) {
      options.body = dados;
    } else {
      options.body = JSON.stringify(dados);
    }
    return await apiFetch(`${API_URL}/criar`, options);
  },

  // Atualizar usuário (aceita FormData para upload de foto)
  update: async (id, dados) => {
    const options = { method: "PUT" };
    if (dados instanceof FormData) {
      if (!dados.get("id_usuario")) dados.append("id_usuario", id);
      options.body = dados;
    } else {
      options.body = JSON.stringify({ id_usuario: id, ...dados });
    }
    return await apiFetch(`${API_URL}/${id}/atualizar`, options);
  },

  // Excluir usuário
  delete: async (id) => {
    return await apiFetch(`${API_URL}/${id}/deletar`, {
      method: "DELETE"
    });
  },
};
