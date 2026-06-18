import { apiFetch } from "@/lib/api";

const API_URL = "/api/maquinas";

export const maquinaCrudService = {
  getAll: async () => {
    // Busca um limite alto para contornar a paginação do backend na listagem do dashboard
    return await apiFetch(`${API_URL}/?limite=500`);
  },

  getById: async (id) => {
    const options = { method: "GET" };
    return await apiFetch(`${API_URL}/${id}`,options);
  },

  create: async (dados) => {
    const options = { method: "POST" };
    if (dados instanceof FormData) {
      options.body = dados;
    } else {
      options.headers = { "Content-Type": "application/json" };
      options.body = JSON.stringify(dados);
    }
    // if (dados instanceof FormData && dados.has("status")) {
    //   dados.set("status_atual", dados.get("status"));
    // }
    return await apiFetch(`${API_URL}/criarMaquina`, options);
  },

  update: async (id, dados) => {
    const options = { method: "PUT" };
    if (dados instanceof FormData) {
      options.body = dados;
    } else {
      options.headers = { "Content-Type": "application/json" };
      options.body = JSON.stringify(dados);
    }
    return await apiFetch(`${API_URL}/${id}`, options);
  },

  delete: async (id) => {
    return await apiFetch(`${API_URL}/${id}`, { method: "DELETE" });
  },
};


