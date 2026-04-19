import { apiFetch } from "./api";
import {
  SetorArraySchema,
  SetorKPISchema,
  OEEPorSetorArraySchema,
  RefugoPorSetorArraySchema,
  OEECriticoSchema,
} from "@features/setores/schemas/setorSchema";
import {
  mockSetores,
  mockSetorTotalKPI,
  mockOperadoresMediaKPI,
  mockOEEPorSetor,
  mockRefugoPorSetor,
  mockOEECritico,
} from "./mockData";

const USE_MOCK = true;

export const setorService = {
  async getSetores() {
    if (USE_MOCK) return SetorArraySchema.parse(mockSetores);
    const data = await apiFetch("/setores");
    return SetorArraySchema.parse(data);
  },
};

export const setorTotalKPIService = {
  async getKPI() {
    if (USE_MOCK) return SetorKPISchema.parse(mockSetorTotalKPI);
    const data = await apiFetch("/setores/kpi/total");
    return SetorKPISchema.parse(data);
  },
};

export const operadoresMediaKPIService = {
  async getKPI() {
    if (USE_MOCK) return SetorKPISchema.parse(mockOperadoresMediaKPI);
    const data = await apiFetch("/setores/kpi/operadores-media");
    return SetorKPISchema.parse(data);
  },
};

export const oeeSetorService = {
  async getOEEPorSetor() {
    if (USE_MOCK) return OEEPorSetorArraySchema.parse(mockOEEPorSetor);
    const data = await apiFetch("/setores/oee");
    return OEEPorSetorArraySchema.parse(data);
  },
};

export const refugoSetorService = {
  async getRefugoPorSetor() {
    if (USE_MOCK) return RefugoPorSetorArraySchema.parse(mockRefugoPorSetor);
    const data = await apiFetch("/setores/refugo");
    return RefugoPorSetorArraySchema.parse(data);
  },
};

export const oeeCriticoService = {
  async getOEECritico() {
    if (USE_MOCK) return OEECriticoSchema.parse(mockOEECritico);
    const data = await apiFetch("/setores/oee-critico");
    return OEECriticoSchema.parse(data);
  },
};