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

import { ProducaoTotalArraySchema } from "@features/maquinas/schemas/maquinaStatusSchema";
import { mockProducaoTotal3Meses, mockProducaoTotal30Dias, mockProducaoTotal7Dias } from "./mockData";


const USE_MOCK = true;

export const maquinaStatusService = {
  async getStatus(setorId = null) {
    if (USE_MOCK) {
      const data = MaquinaStatusArraySchema.parse(mockMaquinaStatus);
      // Se setorId for fornecido, filtra apenas máquinas do setor
      if (setorId) {
        return data.filter(item => item.setorId === setorId);
      }
      return data;
    }
    const url = setorId ? `/api/maquinas/dashboard/status-geral?setorId=${setorId}` : "/api/maquinas/dashboard/status-geral";
    const data = await apiFetch(url);
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
  async getQtdPorSetor(setorId = null) {
    if (USE_MOCK) {
      const data = QtdMaquinaPorSetorArraySchema.parse(mockQtdMaquinasPorSetor);
      // Se setorId for fornecido, filtra apenas o setor específico
      if (setorId) {
        return data.filter(item => item.id === setorId);
      }
      return data;
    }
    const url = setorId ? `/api/maquinas/quantidade_por_setor?setorId=${setorId}` : "/api/maquinas/quantidade_por_setor";
    const data = await apiFetch(url);
    return QtdMaquinaPorSetorArraySchema.parse(data);
  },
};

export const tempoMedioParadaService = {
  async getTempoMedio(setorId = null) {
    if (USE_MOCK) {
      const data = TempoMedioParadaArraySchema.parse(mockTempoMedioParada);
      // Se setorId for fornecido, filtra apenas dados do setor
      if (setorId) {
        return data.filter(item => item.setorId === setorId);
      }
      return data;
    }
    const url = setorId ? `/api/maquinas/tempo_medio_parada?setorId=${setorId}` : "/api/maquinas/tempo_medio_parada";
    const data = await apiFetch(url);
    return TempoMedioParadaArraySchema.parse(data);
  },
};

export const producaoDefeitosService = {
  async getProducaoDefeitos(setorId = null) {
    if (USE_MOCK) {
      const data = ProducaoDefeitoPorSetorArraySchema.parse(mockProducaoDefeitos);
      // Se setorId for fornecido, filtra apenas dados do setor
      if (setorId) {
        return data.filter(item => item.setorId === setorId);
      }
      return data;
    }
    const url = setorId ? `/api/maquinas/producao_defeitos?setorId=${setorId}` : "/api/maquinas/producao_defeitos";
    const data = await apiFetch(url);
    return ProducaoDefeitoPorSetorArraySchema.parse(data);
  },
};

export const maquinasPorTurnoService = {
  async getMaquinasPorTurno(setorId = null) {
    if (USE_MOCK) {
      const data = MaquinaPorTurnoArraySchema.parse(mockMaquinasPorTurno);
      // Se setorId for fornecido, filtra apenas dados do setor
      if (setorId) {
        return data.filter(item => item.setorId === setorId);
      }
      return data;
    }
    const url = setorId ? `/api/maquinas/status_por_turno?setorId=${setorId}` : "/api/maquinas/status_por_turno";
    const data = await apiFetch(url);
    return MaquinaPorTurnoArraySchema.parse(data);
  },
};

const MOCK_POR_PERIODO = {
  "3meses": mockProducaoTotal3Meses,
  "30dias": mockProducaoTotal30Dias,
  "7dias":  mockProducaoTotal7Dias,
};

export const producaoTotalService = {
  async getProducaoTotal(periodo = "3meses", setorId = null) {
    if (USE_MOCK) {
      const data = ProducaoTotalArraySchema.parse(MOCK_POR_PERIODO[periodo]);
      // Se setorId for fornecido, filtra apenas dados do setor
      if (setorId) {
        return data.filter(item => item.setorId === setorId);
      }
      return data;
    }
    const url = setorId
      ? `/api/maquinas/producao_total?periodo=${periodo}&setorId=${setorId}`
      : `/api/maquinas/producao_total?periodo=${periodo}`;
    const data = await apiFetch(url);
    return ProducaoTotalArraySchema.parse(data);
  },
};