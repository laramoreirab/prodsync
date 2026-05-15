import { apiFetch } from "@/lib/api";
import {
  AndonRankingArraySchema,
  AndonSectionArraySchema,
  AndonStatusMaquinasSchema,
} from "@features/andon/schemas/andonSchema";
import {
  mockAndonFactoryRanking,
  mockAndonFactorySections,
  mockAndonFactoryStatusMaquinas,
  mockAndonSectorRanking,
  mockAndonSectorSections,
  mockAndonSectorStatusMaquinas,
} from "./mockData";

const USE_MOCK = true;

function normalizeScope(scope = "factory") {
  return scope === "sector" ? "sector" : "factory";
}

export const andonStatusService = {
  async getStatus(scope = "factory", id_setor = null) {
    const normalizedScope = normalizeScope(scope);
    const params = new URLSearchParams({ scope: normalizedScope });
    if (id_setor) params.append("id_setor", id_setor);

    if (USE_MOCK) {
      return AndonStatusMaquinasSchema.parse(statusByScope[normalizedScope]);
    }

    const data = await apiFetch(`/api/andon/status_maquinas?scope=${normalizedScope}`);
    return AndonStatusMaquinasSchema.parse(data.dados ?? data);
    // const data = await apiFetch(`/api/andon/status_maquinas?${params.toString()}`);
    // return AndonStatusMaquinasSchema.parse(data);
  },
};

export const andonRankingService = {
  async getRanking(scope = "factory", id_setor = null) {
    const normalizedScope = normalizeScope(scope);
    const params = new URLSearchParams({ scope: normalizedScope });
    if (id_setor) params.append("id_setor", id_setor);

    if (USE_MOCK) {
      return AndonRankingArraySchema.parse(rankingByScope[normalizedScope]);
    }

    const data = await apiFetch(`/api/andon/ranking_produtividade?scope=${normalizedScope}`);
    return AndonRankingArraySchema.parse(data.dados ?? data);
    // const data = await apiFetch(`/api/andon/ranking_produtividade?${params.toString()}`);
    // return AndonRankingArraySchema.parse(data);
  },
};

export const andonSectionsService = {
  async getSections(scope = "factory", id_setor = null) {
    const normalizedScope = normalizeScope(scope);
    const params = new URLSearchParams({ scope: normalizedScope });
    if (id_setor) params.append("id_setor", id_setor);

    if (USE_MOCK) {
      return AndonSectionArraySchema.parse(sectionsByScope[normalizedScope]);
    }

    const data = await apiFetch(`/api/andon/secoes?scope=${normalizedScope}`);
    return AndonSectionArraySchema.parse(data.dados ?? data);
    // const data = await apiFetch(`/api/andon/secoes?${params.toString()}`);
    // return AndonSectionArraySchema.parse(data);
  },
};