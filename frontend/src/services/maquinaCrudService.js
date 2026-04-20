import { apiFetch } from "./api";

export const maquinaCrudService = {
  async cadastrar(payload) {
    return await apiFetch("/api/maquinas", {
      method: "POST",
      body: payload,
      headers: {}
    });
  },

  async editar(id, payload) {
    return await apiFetch(`/api/maquinas/${id}`, {
      method: "PUT",
      body: payload,
      headers: {}
    });
  },

  async excluir(id) {
    return await apiFetch(`/api/maquinas/${id}`, {
      method: "DELETE",
    });
  }
};