import { apiFetch } from "@/lib/api";

const API_URL = "/api/eventos";

export const eventosCrudService = {
  // Buscar todos os eventos (paginado)
  getAll: async (pagina = 1, limite = 50) => {
    const res = await apiFetch(`${API_URL}?pagina=${pagina}&limite=${limite}`);
    return res;
  },

  // Buscar evento por id
  getById: async (id) => {
    const res = await apiFetch(`${API_URL}/${id}`);
    // Backend retorna { sucesso, dados }
    return res.dados ?? res;
  },

  // Buscar eventos justificados
  getJustificados: async (pagina = 1, limite = 50) => {
    const res = await apiFetch(`${API_URL}/justificadas?pagina=${pagina}&limite=${limite}`);
    return res;
  },

  // Buscar eventos não justificados
  getNaoJustificados: async (pagina = 1, limite = 50) => {
    const res = await apiFetch(`${API_URL}/nao-justificadas?pagina=${pagina}&limite=${limite}`);
    return res;
  },

  // Registrar evento manualmente (ADM/Gestor)
  create: async (dados) => {
    return await apiFetch(`${API_URL}/sistema`, {
      method: "POST",
      body: JSON.stringify(dados),
    });
  },

  // Justificar evento existente: { id_evento, id_motivo_parada, observacao }
  justificar: async (dados) => {
    return await apiFetch(`${API_URL}/justificar`, {
      method: "POST",
      body: JSON.stringify(dados),
    });
  },

  // Buscar evento pendente de justificativa (operador logado)
  getEventoPendente: async () => {
    const res = await apiFetch(`${API_URL}/pendente`);
    return res.dados ?? null;
  },

  // Buscar motivos de parada disponíveis
  getMotivos: async () => {
    const res = await apiFetch(`${API_URL}/motivos-parada`);
    return res.dados ?? [];
  },
};