import { apiFetch } from "./api";
import { mockTopMotivosTempo } from "./mockData";
import { MotivoTempoArraySchema } from "@/features/eventos/shemas/eventosSchema";

const mockTempoParadoProduzindo = [
  { name: "produzindo", value: 62 },
  { name: "parado",     value: 38 },
];

const USE_MOCK = true;

export const eventosService = {
  async getParadasComparadas() {
    if (USE_MOCK) return mockTempoParadoProduzindo;
    const data = await apiFetch("/eventos/tempo_parado_produzindo");
    return data;
  },
};

export const topMotivosTempoService = {
  async getTopMotivosTempo() {
    if (USE_MOCK) return MotivoTempoArraySchema.parse(mockTopMotivosTempo);
    const data = await apiFetch("/eventos/top_motivos_tempo");
    return MotivoTempoArraySchema.parse(data);
  },
};