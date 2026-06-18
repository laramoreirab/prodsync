import { apiFetch } from "@/lib/api"
import {
  MaquinaStatusArraySchema,
  MaquinaAtivaPorTurnoSchema,
  QtdMaquinaPorSetorArraySchema,
  TempoMedioParadaArraySchema,
  ProducaoDefeitoPorSetorArraySchema,
  MaquinaPorTurnoArraySchema,
} from "@features/maquinas/schemas/maquinaStatusSchema";
import {
  mockMaquinaStatus,
  mockMaquinaAtivaPorTurno,
  mockQtdMaquinasPorSetor,
  mockTempoMedioParada,
  mockProducaoDefeitos,
  mockMaquinasPorTurno,
} from "./mockData";

const USE_MOCK = false;

const labelOrFallback = (value, fallback) => {
  const label = String(value ?? "").trim();
  return label || fallback;
};

export const maquinaStatusService = {
  async getStatus(setorId = null) {
    if (USE_MOCK) return MaquinaStatusArraySchema.parse(mockMaquinaStatus);
    const query = setorId ? `?setorId=${encodeURIComponent(setorId)}` : "";
    const data = await apiFetch(`/api/maquinas/dashboard/status-geral${query}`);
    const normalized = (data.dados || data || []).map((item) => ({
      ...item,
      name: labelOrFallback(item.name, "Sem status"),
    }));
    return MaquinaStatusArraySchema.parse(normalized);
  },
};

export const maquinaAtivaPorTurnoService = {
  async getMaquinaAtivaPorTurnoService(setorId = null) {
    if (USE_MOCK) return MaquinaAtivaPorTurnoSchema.parse(mockMaquinaAtivaPorTurno);
    const query = setorId ? `?setorId=${encodeURIComponent(setorId)}` : "";
    const data = await apiFetch(`/api/turnos/kpis/turno-atual${query}`)
    return MaquinaAtivaPorTurnoSchema.parse(data.dados.cards.maquinasAtivas);
  },
};

export const qtdMaquinasPorSetorService = {
  async getQtdPorSetor(setorId = null) {
    if (USE_MOCK) return QtdMaquinaPorSetorArraySchema.parse(mockQtdMaquinasPorSetor);
    const query = setorId ? `?setorId=${encodeURIComponent(setorId)}` : "";
    const data = await apiFetch(`/api/setores/obterQuantidadeMaquinasPorSetor${query}`);
    const normalized = (data.dados || []).map((item) => ({
      ...item,
      setor: labelOrFallback(item.setor, "Sem setor"),
    }));
    return QtdMaquinaPorSetorArraySchema.parse(normalized);
  },
};

export const tempoMedioParadaService = {
  async getTempoMedio(setorId = null) {
    if (USE_MOCK) return TempoMedioParadaArraySchema.parse(mockTempoMedioParada);
    const query = setorId ? `?setorId=${encodeURIComponent(setorId)}` : "";
    const data = await apiFetch(`/api/setores/obterTempoMedioParadaPorSetor${query}`);
    const normalized = (data.dados || []).map((item) => ({
      ...item,
      maquina: labelOrFallback(item.maquina, "Sem máquina"),
    }));
    return TempoMedioParadaArraySchema.parse(normalized);
  },
};

export const producaoDefeitosService = {
  async getProducaoDefeitos(setorId = null) {
    if (USE_MOCK) return ProducaoDefeitoPorSetorArraySchema.parse(mockProducaoDefeitos);
    const query = setorId ? `?setorId=${setorId}` : "";
    const data = await apiFetch(`/api/setores/obterProducaoDefeitosPorSetor${query}`);
    const normalized = (data.dados || []).map((item) => ({
      ...item,
      maquina: labelOrFallback(item.maquina ?? item.setor, "Sem setor"),
    }));
    return ProducaoDefeitoPorSetorArraySchema.parse(normalized);
  },
};

export const maquinasPorTurnoService = {
  async getMaquinasPorTurno(setorId = null) {
    if (USE_MOCK) return MaquinaPorTurnoArraySchema.parse(mockMaquinasPorTurno);
    const query = setorId ? `?setorId=${encodeURIComponent(setorId)}` : "";
    const data = await apiFetch(`/api/turnos/status-maquinas-por-turno${query}`);
    const normalized = (data.dados || []).map((item) => ({
      ...item,
      turno: labelOrFallback(item.turno, "Sem turno"),
    }));
    return MaquinaPorTurnoArraySchema.parse(normalized);
  },
};
