import { apiFetch } from "@/lib/api";

export const maquinaSyncService = {
  iniciarSincronizacaoPlaca: async (maquinaId) => {
    const data = await apiFetch(`/api/maquinas/${maquinaId}/sincronizar-placa`, {
      method: "POST",
    });
    return data?.dados ?? data;
  },
};

