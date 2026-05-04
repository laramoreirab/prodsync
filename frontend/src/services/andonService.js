import { apiFetch } from "./api";
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

export const andonStatusService = {
  async getStatus(scope = "factory") {
    const normalizedScope = normalizeScope(scope);

    if (USE_MOCK) {
      return AndonStatusMaquinasSchema.parse(statusByScope[normalizedScope]);
    }

    const data = await apiFetch(`/andon/status_maquinas?scope=${normalizedScope}`);
    return AndonStatusMaquinasSchema.parse(data);
  },
};

export const andonRankingService = {
  async getRanking(scope = "factory") {
    const normalizedScope = normalizeScope(scope);

    if (USE_MOCK) {
      return AndonRankingArraySchema.parse(rankingByScope[normalizedScope]);
    }

    const data = await apiFetch(`/andon/ranking_produtividade?scope=${normalizedScope}`);
    return AndonRankingArraySchema.parse(data);
  },
};

export const andonSectionsService = {
  async getSections(scope = "factory") {
    const normalizedScope = normalizeScope(scope);

    if (USE_MOCK) {
      return AndonSectionArraySchema.parse(sectionsByScope[normalizedScope]);
    }

    const data = await apiFetch(`/andon/secoes?scope=${normalizedScope}`);
    return AndonSectionArraySchema.parse(data);
  },
};
