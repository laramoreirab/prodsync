import { apiFetch } from "@/lib/api";

export const maquinaSyncService = {
  iniciarSincronizacaoPlaca: async (maquinaId) => {
    const data = await apiFetch(`/api/maquinas/${maquinaId}/sincronizar-placa`, {
      method: "POST",
    });
    return data?.dados ?? data;
  },

  obterStatusSincronizacaoPlaca: async (maquinaId) => {
    const data = await apiFetch(`/api/maquinas/${maquinaId}/sincronizacao-placa`);
    return data?.dados ?? data;
  },

  pararSincronizacaoPlaca: async (maquinaId) => {
    const data = await apiFetch(`/api/maquinas/${maquinaId}/parar-sincronizacao`, {
      method: "POST",
    });
    return data?.dados ?? data;
  },
};

