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

export const maquinaStatusService = {
  async getStatus(setorId = null) {
    if (USE_MOCK) return MaquinaStatusArraySchema.parse(mockMaquinaStatus);
    const query = setorId ? `?setorId=${encodeURIComponent(setorId)}` : "";
    const data = await apiFetch(`/api/maquinas/dashboard/status-geral${query}`);
    return MaquinaStatusArraySchema.parse(data.dados || data);
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
    return QtdMaquinaPorSetorArraySchema.parse(data.dados);
  },
};

export const tempoMedioParadaService = {
  async getTempoMedio(setorId = null) {
    if (USE_MOCK) return TempoMedioParadaArraySchema.parse(mockTempoMedioParada);
    const query = setorId ? `?setorId=${encodeURIComponent(setorId)}` : "";
    const data = await apiFetch(`/api/setores/obterTempoMedioParadaPorSetor${query}`);
    return TempoMedioParadaArraySchema.parse(data.dados);
  },
};

export const producaoDefeitosService = {
  async getProducaoDefeitos(setorId = null) {
    if (USE_MOCK) return ProducaoDefeitoPorSetorArraySchema.parse(mockProducaoDefeitos);
    const query = setorId ? `?setorId=${setorId}` : "";
    const data = await apiFetch(`/api/setores/obterProducaoDefeitosPorSetor${query}`);
    return ProducaoDefeitoPorSetorArraySchema.parse(data.dados);
  },
};

export const maquinasPorTurnoService = {
  async getMaquinasPorTurno(setorId = null) {
    if (USE_MOCK) return MaquinaPorTurnoArraySchema.parse(mockMaquinasPorTurno);
    const query = setorId ? `?setorId=${encodeURIComponent(setorId)}` : "";
    const data = await apiFetch(`/api/turnos/status-maquinas-por-turno${query}`);
    return MaquinaPorTurnoArraySchema.parse(data.dados);
  },
};
