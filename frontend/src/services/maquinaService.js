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
  async getStatus() {
    if (USE_MOCK) return MaquinaStatusArraySchema.parse(mockMaquinaStatus);
    const data = await apiFetch("/api/maquinas/dashboard/status-geral");
    return MaquinaStatusArraySchema.parse(data.dados);
  },
};

export const maquinaAtivaPorTurnoService = {
  async getMaquinaAtivaPorTurnoService() {
    if (USE_MOCK) return MaquinaAtivaPorTurnoSchema.parse(mockMaquinaAtivaPorTurno);
    const data = await apiFetch("/api/turnos/kpis/turno-atual")
    return MaquinaAtivaPorTurnoSchema.parse(data.dados.cards.maquinasAtivas);
  },
};

export const qtdMaquinasPorSetorService = {
  async getQtdPorSetor() {
    if (USE_MOCK) return QtdMaquinaPorSetorArraySchema.parse(mockQtdMaquinasPorSetor);
    const data = await apiFetch("/api/setores/obterQuantidadeMaquinasPorSetor");
    return QtdMaquinaPorSetorArraySchema.parse(data.dados);
  },
};

export const tempoMedioParadaService = {
  async getTempoMedio() {
    if (USE_MOCK) return TempoMedioParadaArraySchema.parse(mockTempoMedioParada);
    const data = await apiFetch("/api/setores/obterTempoMedioParadaPorSetor");
    return TempoMedioParadaArraySchema.parse(data.dados);
  },
};

export const producaoDefeitosService = {
  async getProducaoDefeitos() {
    if (USE_MOCK) return ProducaoDefeitoPorSetorArraySchema.parse(mockProducaoDefeitos);
    const data = await apiFetch("/api/setores/obterProducaoDefeitosPorSetor");
    return ProducaoDefeitoPorSetorArraySchema.parse(data.dados);
  },
};

export const maquinasPorTurnoService = {
  async getMaquinasPorTurno() {
    if (USE_MOCK) return MaquinaPorTurnoArraySchema.parse(mockMaquinasPorTurno);
    const data = await apiFetch("/api/turnos/status-maquinas-por-turno");
    return MaquinaPorTurnoArraySchema.parse(data.dados);
  },
};