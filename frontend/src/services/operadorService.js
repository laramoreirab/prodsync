import { apiFetch } from "./api";
import {
  OEEOperadorSchema,
  PecasPorDiaArraySchema,
  ProducaoPorHoraOperadorArraySchema,
  MetaProducaoSchema,
  TempoParadoTempoProduzindoOperadorArraySchema,
  EficienciaMaquinaArraySchema,
  MetaKPISchema,
  ProdutividadeDiaSchema,
  QualidadeSchema,
  VelocimetroSchema,
} from "@features/operador/schemas/operadorSchema";

import {
  mockOEEOperador,
  mockPecasPorDia,
  mockProducaoPorHoraOperador,
  mockMetaProducao,
  mockTempoParadoTempoProduzindoOperador,
  mockEficienciaMaquina,
  mockMetaKPI,
  mockProdutividadeDia,
  mockQualidade,
  mockVelocimetro,
  mockOEEMaquinaOperador,
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

export const TempoParadoTempoProduzindoOperadorService = {
  async getTempoParadoTempoProduzindoOperador(operadorId) {
    if (USE_MOCK) return TempoParadoTempoProduzindoOperadorArraySchema.parse(mockTempoParadoTempoProduzindoOperador);
    const data = await apiFetch(`/operador/${operadorId}/tempo_parado_tempo_produzindo_operador`);
    return TempoParadoTempoProduzindoOperadorArraySchema.parse(data);
  },
};

export const eficienciaMaquinaService = {
  async getEficiencia(operadorId) {
    if (USE_MOCK) return EficienciaMaquinaArraySchema.parse(mockEficienciaMaquina);
    const data = await apiFetch(`/operador/${operadorId}/eficiencia_maquinas`);
    return EficienciaMaquinaArraySchema.parse(data);
  },
};

export const metaKPIService = {
  async getMetaKPI(operadorId) {
    if (USE_MOCK) return MetaKPISchema.parse(mockMetaKPI);
    const data = await apiFetch(`/operador/${operadorId}/meta_kpi`);
    return MetaKPISchema.parse(data);
  },
};

export const produtividadeDiaService = {
  async getProdutividade(operadorId) {
    if (USE_MOCK) return ProdutividadeDiaSchema.parse(mockProdutividadeDia);
    const data = await apiFetch(`/operador/${operadorId}/produtividade_dia`);
    return ProdutividadeDiaSchema.parse(data);
  },
};

export const qualidadeService = {
  async getQualidade(operadorId) {
    if (USE_MOCK) return QualidadeSchema.parse(mockQualidade);
    const data = await apiFetch(`/operador/${operadorId}/qualidade`);
    return QualidadeSchema.parse(data);
  },
};

export const velocimetroService = {
  async getVelocimetro(operadorId) {
    if (USE_MOCK) return VelocimetroSchema.parse(mockVelocimetro);
    const data = await apiFetch(`/operador/${operadorId}/velocimetro`);
    return VelocimetroSchema.parse(data);
  },
};

export const oeeMaquinaService = {
  async getOEEMaquina(id_usuario) {
    if (USE_MOCK) return mockOEEMaquinaOperador; // array direto
    const data = await apiFetch(`/operador/${id_usuario}/oee_maquina`);
    return data.dados;
  },
};