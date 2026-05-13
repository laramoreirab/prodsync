import { apiFetch } from "@/lib/api";
import {
  AndonRankingArraySchema,
  AndonSectionArraySchema,
  AndonStatusMaquinasSchema,
} from "@features/andon/schemas/andonSchema";

function normalizeScope(scope = "factory") {
  return scope === "sector" ? "sector" : "factory";
}

export const andonStatusService = {
  async getStatus(scope = "factory", id_setor = null) {
    const normalizedScope = normalizeScope(scope);
    const params = new URLSearchParams({ scope: normalizedScope });
    if (id_setor) params.append("id_setor", id_setor);

    const data = await apiFetch(`/api/andon/status_maquinas?${params.toString()}`);
    return AndonStatusMaquinasSchema.parse(data);
  },
};

export const andonRankingService = {
  async getRanking(scope = "factory", id_setor = null) {
    const normalizedScope = normalizeScope(scope);
    const params = new URLSearchParams({ scope: normalizedScope });
    if (id_setor) params.append("id_setor", id_setor);

    const data = await apiFetch(`/api/andon/ranking_produtividade?${params.toString()}`);
    return AndonRankingArraySchema.parse(data);
  },
};

export const andonSectionsService = {
  async getSections(scope = "factory", id_setor = null) {
    const normalizedScope = normalizeScope(scope);
    const params = new URLSearchParams({ scope: normalizedScope });
    if (id_setor) params.append("id_setor", id_setor);

    const data = await apiFetch(`/api/andon/secoes?${params.toString()}`);
    return AndonSectionArraySchema.parse(data);
  },
};