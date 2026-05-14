import { apiFetch } from "@/lib/api"
import { MotivoTempoArraySchema } from "@/features/eventos/shemas/eventosSchema";

const USE_MOCK = false;

export const eventosService = {
  async getParadasComparadas(setorId = null) {
    const url = setorId
      ? `/api/eventos/tempo_parado_produzindo?setorId=${encodeURIComponent(setorId)}`
      : "/api/eventos/tempo_parado_produzindo";
    const data = await apiFetch(url);
    return (data.dados || data).map((item) => ({
      name: item.name ?? item.nome,
      value: item.value ?? item.valor,
    }));
  },
};

export const topMotivosTempoService = {
  async getTopMotivosTempo(setorId = null) {
    const url = setorId
      ? `/api/eventos/top_motivos_tempo?setorId=${encodeURIComponent(setorId)}`
      : "/api/eventos/top_motivos_tempo";
    const data = await apiFetch(url);
    return MotivoTempoArraySchema.parse(data.dados);
  },
};
