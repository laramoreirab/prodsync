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

const USE_MOCK = false;

const statusByScope = {
  factory: mockAndonFactoryStatusMaquinas,
  sector: mockAndonSectorStatusMaquinas,
};

const rankingByScope = {
  factory: mockAndonFactoryRanking,
  sector: mockAndonSectorRanking,
};

const sectionsByScope = {
  factory: mockAndonFactorySections,
  sector: mockAndonSectorSections,
};

function normalizeScope(scope = "factory") {
  return scope === "sector" ? "sector" : "factory";
}

function buildParams(scope, id_setor) {
  const params = new URLSearchParams({ scope: normalizeScope(scope) });
  if (id_setor) params.append("id_setor", id_setor);
  return params.toString();
}

function extractData(data) {
  return data?.dados ?? data;
}

export const andonStatusService = {
  async getStatus(scope = "factory", id_setor = null) {
    const normalizedScope = normalizeScope(scope);

    if (USE_MOCK) {
      return AndonStatusMaquinasSchema.parse(statusByScope[normalizedScope]);
    }

    const data = await apiFetch(`/api/andon/status_maquinas?${buildParams(normalizedScope, id_setor)}`);
    return AndonStatusMaquinasSchema.parse(extractData(data));
  },
};

export const andonRankingService = {
  async getRanking(scope = "factory", id_setor = null) {
    const normalizedScope = normalizeScope(scope);

    if (USE_MOCK) {
      return AndonRankingArraySchema.parse(rankingByScope[normalizedScope]);
    }

    const data = await apiFetch(`/api/andon/ranking_produtividade?${buildParams(normalizedScope, id_setor)}`);
    return AndonRankingArraySchema.parse(extractData(data));
  },
};

export const andonSectionsService = {
  async getSections(scope = "factory", id_setor = null) {
    const normalizedScope = normalizeScope(scope);

    if (USE_MOCK) {
      return AndonSectionArraySchema.parse(sectionsByScope[normalizedScope]);
    }

    const data = await apiFetch(`/api/andon/secoes?${buildParams(normalizedScope, id_setor)}`);
    return AndonSectionArraySchema.parse(extractData(data));
  },
};
