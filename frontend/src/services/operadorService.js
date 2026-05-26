import { apiFetch } from "@/lib/api";
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

// Recebe `operadorId` para quando o backend estiver pronto

export const oeeOperadorService = {
  async getOEE(operadorId) {
    const maquina = await apiFetch(`/api/maquinas/obter-maquina-operador/${operadorId}`, { method: "GET" });
    const maquinaId = maquina?.id_maquina ?? maquina?.dados?.id_maquina;
    if (!maquinaId) return OEEOperadorSchema.parse({ disponibilidade: 0, performance: 0, qualidade: 0, oee: 0 });
    const data = await apiFetch(`/api/oee/maquinas/${maquinaId}`);
    return OEEOperadorSchema.parse(data.dados);
  },
};

export const pecasPorDiaService = {
  async getPecasPorDia(operadorId) {
    const data = await apiFetch(`/api/usuarios/${operadorId}/pecas_por_dia`);
    return PecasPorDiaArraySchema.parse(data.dados);
  },
};

export const producaoPorHoraOperadorService = {
  async getPorHora(operadorId) {
    const data = await apiFetch(`/api/usuarios/${operadorId}/producao_por_hora`);
    return ProducaoPorHoraOperadorArraySchema.parse(data.dados);
  },
};

export const metaProducaoService = {
  async getMeta(operadorId) {
    const data = await apiFetch(`/api/usuarios/${operadorId}/meta`);
    return MetaProducaoSchema.parse(data.dados);
  },
};

export const TempoParadoTempoProduzindoOperadorService = {
  async getTempoParadoTempoProduzindoOperador(operadorId) {
    const data = await apiFetch(`/api/usuarios/${operadorId}/tempo_parado_tempo_produzindo_operador`);
    return TempoParadoTempoProduzindoOperadorArraySchema.parse(data.dados);
  },
};

export const eficienciaMaquinaService = {
  async getEficiencia(operadorId) {
    const data = await apiFetch(`/api/maquinas/eficienciaMaquina/${operadorId}`);
    return EficienciaMaquinaArraySchema.parse(data.dados);
  },
};

export const metaKPIService = {
  async getMetaKPI(operadorId) {
    const data = await apiFetch(`/api/usuarios/${operadorId}/meta_kpi`);
    return MetaKPISchema.parse(data);
  },
};

export const produtividadeDiaService = {
  async getProdutividade(operadorId) {
    const data = await apiFetch(`/api/usuarios/${operadorId}/produtividade_dia`);
    return ProdutividadeDiaSchema.parse(data.dados);
  },
};

export const qualidadeService = {
  async getQualidade(operadorId) {
    const data = await apiFetch(`/api/usuarios/${operadorId}/qualidade`);
    return QualidadeSchema.parse(data.dados);
  },
};

export const velocimetroService = {
  async getVelocimetro(operadorId) {
    const data = await apiFetch(`/api/usuarios/${operadorId}/velocimetro`);
    return VelocimetroSchema.parse(data.dados);
  },
};

export const oeeMaquinaService = {
  async getOEEMaquina(id_usuario) {
    const data = await apiFetch(`/api/usuarios/${id_usuario}/oee_maquinas`);
    return data.dados;
  },
};

export const oeeMaquinaDetalhesService = {
  async getDetalhes(id_usuario) {
    const data = await apiFetch(`/api/usuarios/${id_usuario}/maquina_oee_detalhe`);
    return data.dados;
  },
};