import { apiFetch } from "@/lib/api";

const API_URL = "/api/setores";

export const setorCrudService = {
  getAll: async () => {
    // Busca um limite alto para contornar a paginação do backend
    return await apiFetch(`${API_URL}/empresa?limite=100`);
  },

  // buscar setor por ID — id vai na URL
  getById: async (id) => {
     const options = { method: "GET" };
    return await apiFetch(`${API_URL}/${id}`, options);
  },

  // criar setor
  // campos: nome_setor, localizacao
  create: async (dados) => {
    const response = await apiFetch(`${API_URL}/criarSetor`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados),
    });
    return response.dados || response;
  },

  // atualizar setor — id vai na URL
  // campos: nome_setor
  update: async (id, dados) => {
    return await apiFetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados),
    });
  },

  // deletar setor — id vai na URL
  delete: async (id) => {
    await apiFetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });
    return true;
  },

  // associar máquinas ao setor — ids_maquinas (array), id do setor na URL
  associarMaquinas: async (id_setor, ids_maquinas) => {
    return await apiFetch(`${API_URL}/${id_setor}/maquinas`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids_maquinas }),
    });
  },

  // associar gestor ao setor — id_gestor no body, id do setor na URL
  associarGestor: async (id_setor, id_gestor) => {
    return await apiFetch(`${API_URL}/${id_setor}/gestores`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id_gestor }),
    });
  },

  // associar operador ao setor
  associarOperadores: async (id_setor, ids_operadores) => {
    return await apiFetch(`${API_URL}/${id_setor}/operadores`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids_operadores }),
    });
  },

  listarOperadores: async (id_setor) => {
    return await apiFetch(`${API_URL}/${id_setor}/operadores`, {
      method: "GET",
    });
  },

  listarGestores: async (id_setor) => {
    return await apiFetch(`${API_URL}/${id_setor}/gestores`, {
      method: "GET",
    });
  },

  listarTurnos: async (id_setor) => {
    return await apiFetch(`${API_URL}/${id_setor}/turnos`, {
      method: "GET",
    });
  },

  sincronizarTurnos: async (id_setor, ids_turnos) => {
    return await apiFetch(`${API_URL}/${id_setor}/turnos`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids_turnos }),
    });
  },

  atualizarGrupoTurno: async (id_setor, dados) => {
    return await apiFetch(`${API_URL}/${id_setor}/turnos/grupo`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados),
    });
  },
};
