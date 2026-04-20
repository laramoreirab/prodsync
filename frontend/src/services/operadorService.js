import { apiFetch } from "./api";
import {
  OEEOperadorSchema,
  PecasPorDiaArraySchema,
  ProducaoPorHoraOperadorArraySchema,
  MetaProducaoSchema,
  ParadasComparadasOperadorArraySchema,
  EficienciaMaquinaArraySchema,
} from "@features/operador/schemas/operadorSchema";

import {
  mockOEEOperador,
  mockPecasPorDia,
  mockProducaoPorHoraOperador,
  mockMetaProducao,
  mockParadasComparadasOperador,
  mockEficienciaMaquina,
} from "./mockData";

const USE_MOCK = true;

// Recebe `operadorId` para quando o backend estiver pronto

export const oeeOperadorService = {
  async getOEE(operadorId) {
    if (USE_MOCK) return OEEOperadorSchema.parse(mockOEEOperador);
    const data = await apiFetch(`/operador/${operadorId}/oee`);
    return OEEOperadorSchema.parse(data);
  },
};

export const pecasPorDiaService = {
  async getPecasPorDia(operadorId) {
    if (USE_MOCK) return PecasPorDiaArraySchema.parse(mockPecasPorDia);
    const data = await apiFetch(`/operador/${operadorId}/pecas_por_dia`);
    return PecasPorDiaArraySchema.parse(data);
  },
};

export const producaoPorHoraOperadorService = {
  async getPorHora(operadorId) {
    if (USE_MOCK) return ProducaoPorHoraOperadorArraySchema.parse(mockProducaoPorHoraOperador);
    const data = await apiFetch(`/operador/${operadorId}/producao_por_hora`);
    return ProducaoPorHoraOperadorArraySchema.parse(data);
  },
};

export const metaProducaoService = {
  async getMeta(operadorId) {
    if (USE_MOCK) return MetaProducaoSchema.parse(mockMetaProducao);
    const data = await apiFetch(`/operador/${operadorId}/meta`);
    return MetaProducaoSchema.parse(data);
  },
};

export const paradasOperadorService = {
  async getParadas(operadorId) {
    if (USE_MOCK) return ParadasComparadasOperadorArraySchema.parse(mockParadasComparadasOperador);
    const data = await apiFetch(`/operador/${operadorId}/paradas`);
    return ParadasComparadasOperadorArraySchema.parse(data);
  },
};

export const eficienciaMaquinaService = {
  async getEficiencia(operadorId) {
    if (USE_MOCK) return EficienciaMaquinaArraySchema.parse(mockEficienciaMaquina);
    const data = await apiFetch(`/operador/${operadorId}/eficiencia_maquinas`);
    return EficienciaMaquinaArraySchema.parse(data);
  },
};