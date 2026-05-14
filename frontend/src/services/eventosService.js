import { apiFetch } from "@/lib/api"
import { MotivoTempoArraySchema } from "@/features/eventos/shemas/eventosSchema";

export const eventosService = {
  async getParadasComparadas(setorId = null) {
    if (USE_MOCK) return mockTempoParadoProduzindo;
    const url = setorId
      ? `/api/eventos/tempo_parado_produzindo?setorId=${encodeURIComponent(setorId)}`
      : "/api/eventos/tempo_parado_produzindo";
    const data = await apiFetch(url);
    return data;
  },
};

export const topMotivosTempoService = {
  async getTopMotivosTempo(setorId = null) {
    if (USE_MOCK) return MotivoTempoArraySchema.parse(mockTopMotivosTempo);
    const url = setorId
      ? `/api/eventos/top_motivos_tempo?setorId=${encodeURIComponent(setorId)}`
      : "/api/eventos/top_motivos_tempo";
    const data = await apiFetch(url);
    return MotivoTempoArraySchema.parse(data.dados);
  },
};
