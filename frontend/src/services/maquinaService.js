// src/services/maquinaService.js
import { apiFetch } from "./api";
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

const USE_MOCK = true;

export const maquinaStatusService = {
  async getStatus() {
    if (USE_MOCK) return MaquinaStatusArraySchema.parse(mockMaquinaStatus);
    const data = await apiFetch("/api/maquinas/dashboard/status-geral");
    return MaquinaStatusArraySchema.parse(data);
  },
};

export const maquinaAtivaPorTurnoService = {
  async getMaquinaAtivaPorTurnoService() {
    if (USE_MOCK) return MaquinaAtivaPorTurnoSchema.parse(mockMaquinaAtivaPorTurno);
    const data = await apiFetch("/maquinas/ativa_por_turno");
    return MaquinaAtivaPorTurnoSchema.parse(data);
  },
};

export const qtdMaquinasPorSetorService = {
  async getQtdPorSetor() {
    if (USE_MOCK) return QtdMaquinaPorSetorArraySchema.parse(mockQtdMaquinasPorSetor);
    const data = await apiFetch("/maquinas/quantidade_por_setor");
    return QtdMaquinaPorSetorArraySchema.parse(data);
  },
};

export const tempoMedioParadaService = {
  async getTempoMedio() {
    if (USE_MOCK) return TempoMedioParadaArraySchema.parse(mockTempoMedioParada);
    const data = await apiFetch("/maquinas/tempo_medio_parada");
    return TempoMedioParadaArraySchema.parse(data);
  },
};

export const producaoDefeitosService = {
  async getProducaoDefeitos() {
    if (USE_MOCK) return ProducaoDefeitoPorSetorArraySchema.parse(mockProducaoDefeitos);
    const data = await apiFetch("/maquinas/producao_defeitos");
    return ProducaoDefeitoPorSetorArraySchema.parse(data);
  },
};

export const maquinasPorTurnoService = {
  async getMaquinasPorTurno() {
    if (USE_MOCK) return MaquinaPorTurnoArraySchema.parse(mockMaquinasPorTurno);
    const data = await apiFetch("/maquinas/status_por_turno");
    return MaquinaPorTurnoArraySchema.parse(data);
  },
};