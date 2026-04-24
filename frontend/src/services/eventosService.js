import { apiFetch } from "./api";
import { mockParadasComparadas, mockTopMotivosTempo } from "./mockData";
import { ParadasComparadasArraySchema } from "@/features/eventos/shemas/eventosSchema";
import { MotivoTempoArraySchema } from "@/features/eventos/shemas/eventosSchema";

const USE_MOCK = true;

export const eventosService = {
  async getParadasComparadas() {
    if (USE_MOCK) return ParadasComparadasArraySchema.parse(mockParadasComparadas);
    const data = await apiFetch("/eventos/justificativas_comparadas");
    return ParadasComparadasArraySchema.parse(data);
  },
};

export const topMotivosTempoService = {
  async getTopMotivosTempo() {
    if (USE_MOCK) return MotivoTempoArraySchema.parse(mockTopMotivosTempo);
    const data = await apiFetch("/eventos/top_motivos_tempo");
    return MotivoTempoArraySchema.parse(data);
  },
};