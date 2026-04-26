import { apiFetch } from "./api";
import {
  SetorArraySchema,
  SetorKPISchema,
  OEEPorSetorArraySchema,
  RefugoPorSetorArraySchema,
  OEECriticoSchema,
} from "@features/setores/schemas/setorSchema";
import {
    SetorMaquinaStatusSchema,
    SetorOEEMedioSchema,
    SetorOEEEvolucaoArraySchema,
    SetorTopOperadoresArraySchema,
    SetorMotivosParadaArraySchema,
    SetorProducaoSemanalArraySchema,
  } from "@features/setores/schemas/setorSchema";
import {
  mockSetores,
  mockSetorTotalKPI,
  mockOperadoresMediaKPI,
  mockOEEPorSetor,
  mockRefugoPorSetor,
  mockOEECritico,
  mockSetorProducaoSemanal
} from "./mockData";
 import {
    mockSetorMaquinaStatus,
    mockSetorOEEMedio,
    mockSetorOEEEvolucao,
    mockSetorTopOperadores,
    mockSetorMotivosParada,
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
export const setorMaquinaStatusService = {
  async getStatus(setorId) {
    if (USE_MOCK) return SetorMaquinaStatusSchema.parse(mockSetorMaquinaStatus);
    const data = await apiFetch(`/setores/${setorId}/maquinas/status`);
    return SetorMaquinaStatusSchema.parse(data);
  },
};
 
export const setorOEEMedioService = {
  async getOEE(setorId) {
    if (USE_MOCK) return SetorOEEMedioSchema.parse(mockSetorOEEMedio);
    const data = await apiFetch(`/setores/${setorId}/oee_medio`);
    return SetorOEEMedioSchema.parse(data);
  },
};
 
export const setorOEEEvolucaoService = {
  async getEvolucao(setorId) {
    if (USE_MOCK) return SetorOEEEvolucaoArraySchema.parse(mockSetorOEEEvolucao);
    const data = await apiFetch(`/setores/${setorId}/oee_evolucao`);
    return SetorOEEEvolucaoArraySchema.parse(data);
  },
};
 
export const setorTopOperadoresService = {
  async getTopOperadores(setorId) {
    if (USE_MOCK) return SetorTopOperadoresArraySchema.parse(mockSetorTopOperadores);
    const data = await apiFetch(`/setores/${setorId}/top_operadores`);
    return SetorTopOperadoresArraySchema.parse(data);
  },
};
 
export const setorMotivosParadaService = {
  async getMotivos(setorId) {
    if (USE_MOCK) return SetorMotivosParadaArraySchema.parse(mockSetorMotivosParada);
    const data = await apiFetch(`/setores/${setorId}/motivos_parada`);
    return SetorMotivosParadaArraySchema.parse(data);
  },
};

export const setorProducaoSemanalService = {
  async getProducaoSemanal(setorId) {
if (USE_MOCK) return SetorProducaoSemanalArraySchema.parse(mockSetorProducaoSemanal);    const data = await apiFetch(`/setores/${setorId}/producao_semanal`);
    return SetorProducaoSemanalArraySchema.parse(data); 
  },
};