import { apiFetch } from "@/lib/api";

const API_URL = "/api/usuarios";

export const usuariosCrudService = {
  // Buscar todos os usuários (paginado)
  getAll: async (pagina = 1, limite = 50) => {
    const res = await apiFetch(`${API_URL}?pagina=${pagina}&limite=${limite}`);
    // Backend retorna { sucesso, dados, meta }
    return res;
  },

  // Buscar detalhes de um usuário por id
  getById: async (id) => {
    const res = await apiFetch(`${API_URL}/${id}`);
    // Backend retorna { sucesso, dados }
    return res.dados ?? res;
  },

  // Criar novo usuário (aceita FormData para upload de foto)
  create: async (dados) => {
    const options = { method: "POST" };
    if (dados instanceof FormData) {
      options.body = dados;
    } else {
      options.body = JSON.stringify(dados);
    }
    return await apiFetch(API_URL, options);
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
    return await apiFetch(API_URL, options);
  },

  // Excluir usuário
  delete: async (id) => {
    return await apiFetch(API_URL, {
      method: "DELETE",
      body: JSON.stringify({ id_usuario: id }),
    });
  },
};