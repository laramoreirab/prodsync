import { apiFetch } from "./api";
import {
  AndonStatusMaquinasSchema,
  AndonRankingArraySchema,
} from "@features/andon/schemas/andonSchema";
import { mockAndonStatusMaquinas, mockAndonRanking } from "./mockData";
 
const USE_MOCK = true;
 
export const andonStatusService = {
  async getStatus() {
    if (USE_MOCK) return AndonStatusMaquinasSchema.parse(mockAndonStatusMaquinas);
    const data = await apiFetch("/andon/status_maquinas");
    return AndonStatusMaquinasSchema.parse(data);
  },
};
 
export const andonRankingService = {
  async getRanking() {
    if (USE_MOCK) return AndonRankingArraySchema.parse(mockAndonRanking);
    const data = await apiFetch("/andon/ranking_produtividade");
    return AndonRankingArraySchema.parse(data);
  },
};
 