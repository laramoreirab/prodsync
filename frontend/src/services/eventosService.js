import { apiFetch } from "@/lib/api"
import { MotivoTempoArraySchema } from "@/features/eventos/shemas/eventosSchema";

export const eventosService = {
  async getParadasComparadas() {
    const data = await apiFetch("/api/eventos/tempo_parado_produzindo");
    return data;
  },
};

export const topMotivosTempoService = {
  async getTopMotivosTempo() {
    const data = await apiFetch("/api/eventos/top_motivos_tempo");
    return MotivoTempoArraySchema.parse(data.dados);
  },
};