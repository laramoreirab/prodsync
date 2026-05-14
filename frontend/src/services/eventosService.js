import { apiFetch } from "@/lib/api"
import { mockTopMotivosTempo } from "./mockData";
import { MotivoTempoArraySchema } from "@/features/eventos/shemas/eventosSchema";

const mockTempoParadoProduzindo = [
  { name: "produzindo", value: 62 },
  { name: "parado",     value: 38 },
];

const USE_MOCK = false;

export const eventosService = {
  async getParadasComparadas(setorId = null) {
    if (USE_MOCK) return mockTempoParadoProduzindo;
    const url = setorId
      ? `/eventos/tempo_parado_produzindo?setorId=${encodeURIComponent(setorId)}`
      : "/eventos/tempo_parado_produzindo";
    const data = await apiFetch(url);
    return data;
  },
};

export const topMotivosTempoService = {
  async getTopMotivosTempo(setorId = null) {
    if (USE_MOCK) return MotivoTempoArraySchema.parse(mockTopMotivosTempo);
    const url = setorId
      ? `/eventos/top_motivos_tempo?setorId=${encodeURIComponent(setorId)}`
      : "/eventos/top_motivos_tempo";
    const data = await apiFetch(url);
    return MotivoTempoArraySchema.parse(data);
  },
};
