import { apiFetch } from "@/lib/api"
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
  mockOEEMaquinaDetalhes,
} from "./mockData";

const USE_MOCK = false;

// Recebe `operadorId` para quando o backend estiver pronto

export const oeeOperadorService = {
  async getOEE(operadorId) {
    if (USE_MOCK) return OEEOperadorSchema.parse(mockOEEOperador);
    const maquina = await apiFetch(`/api/maquinas/obter-maquina-operador/${operadorId}`, { method: "GET" })
    const maquinaId = maquina?.dados?.id_maquina || maquina?.id_maquina;
    if (!maquinaId) return OEEOperadorSchema.parse({ disponibilidade: 0, performance: 0, qualidade: 0, oee: 0 });
    const data = await apiFetch(`/api/oee/maquinas/${maquinaId}`);
    return OEEOperadorSchema.parse(data.dados);
  },
};

export const pecasPorDiaService = {
  async getPecasPorDia(operadorId) {
    if (USE_MOCK) return PecasPorDiaArraySchema.parse(mockPecasPorDia);
    const data = await apiFetch(`/api/usuarios/${operadorId}/pecas_por_dia`);
    return PecasPorDiaArraySchema.parse(data.dados);
  },
};

export const producaoPorHoraOperadorService = {
  async getPorHora(operadorId) {
    if (USE_MOCK) return ProducaoPorHoraOperadorArraySchema.parse(mockProducaoPorHoraOperador);
    const data = await apiFetch(`/api/usuarios/${operadorId}/producao_por_hora`);
    return ProducaoPorHoraOperadorArraySchema.parse(data.dados);
  },
};

export const metaProducaoService = {
  async getMeta(operadorId) {
    if (USE_MOCK) return MetaProducaoSchema.parse(mockMetaProducao);
    const data = await apiFetch(`/api/usuarios/${operadorId}/meta`);
    return MetaProducaoSchema.parse(data.dados);
  },
};

export const TempoParadoTempoProduzindoOperadorService = {
  async getTempoParadoTempoProduzindoOperador(operadorId) {
    if (USE_MOCK) return TempoParadoTempoProduzindoOperadorArraySchema.parse(mockTempoParadoTempoProduzindoOperador);
    const data = await apiFetch(`/api/usuarios/${operadorId}/tempo_parado_tempo_produzindo_operador`);
    return TempoParadoTempoProduzindoOperadorArraySchema.parse(data.dados);
  },
};

export const eficienciaMaquinaService = {
  async getEficiencia(operadorId) {
    if (USE_MOCK) return EficienciaMaquinaArraySchema.parse(mockEficienciaMaquina);
    const data = await apiFetch(`/api/maquinas/eficienciaMaquina/${operadorId}`);
    return EficienciaMaquinaArraySchema.parse(data.dados);
  },
};

export const metaKPIService = {
  async getMetaKPI(operadorId) {
    if (USE_MOCK) return MetaKPISchema.parse(mockMetaKPI);
    const data = await apiFetch(`/api/usuarios/${operadorId}/meta_kpi`);
    return MetaKPISchema.parse(data);
  },
};

export const produtividadeDiaService = {
  async getProdutividade(operadorId) {
    if (USE_MOCK) return ProdutividadeDiaSchema.parse(mockProdutividadeDia);
    const data = await apiFetch(`/api/usuarios/${operadorId}/produtividade_dia`);
    return ProdutividadeDiaSchema.parse(data.dados);
  },
};

export const qualidadeService = {
  async getQualidade(operadorId) {
    if (USE_MOCK) return QualidadeSchema.parse(mockQualidade);
    const data = await apiFetch(`/api/usuarios/${operadorId}/qualidade`);
    return QualidadeSchema.parse(data.dados);
  },
};

export const velocimetroService = {
  async getVelocimetro(operadorId) {
    if (USE_MOCK) return VelocimetroSchema.parse(mockVelocimetro);
    const data = await apiFetch(`/api/usuarios/${operadorId}/velocimetro`);
    return VelocimetroSchema.parse(data.dados);
  },
};

export const oeeMaquinaService = {
  async getOEEMaquina(id_usuario) {
    if (USE_MOCK) return mockOEEMaquinaOperador; // array direto
    const data = await apiFetch(`/api/usuarios/${id_usuario}/oee_maquina`);
    return data.dados;
  },
};

export const oeeMaquinaDetalhesService = {
  async getDetalhes(id_usuario) {
    if (USE_MOCK) return mockOEEMaquinaDetalhes;
    const data = await apiFetch(`/api/usuarios/${id_usuario}/maquina_oee_detalhes`);
    return data.dados;
  },
};