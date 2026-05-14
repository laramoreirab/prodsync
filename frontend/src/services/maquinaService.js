import { apiFetch } from "@/lib/api";
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


const USE_MOCK = false;

export const maquinaStatusService = {
  async getStatus(setorId = null) {
    if (USE_MOCK) {
      const data = MaquinaStatusArraySchema.parse(mockMaquinaStatus);
      // Se setorId for fornecido, filtra apenas máquinas do setor
      if (setorId) {
        return data.filter(item => String(item.setorId) === String(setorId));
      }
      return data;
    }
    const url = setorId ? `/api/maquinas/dashboard/status-geral?setorId=${setorId}` : "/api/maquinas/dashboard/status-geral";
    const data = await apiFetch(url);
    return MaquinaStatusArraySchema.parse(data.dados);
  },
};

export const maquinaAtivaPorTurnoService = {
  async getMaquinaAtivaPorTurnoService() {
    const data = await apiFetch("/api/turnos/kpis/turno-atual");
    return MaquinaAtivaPorTurnoSchema.parse(data.dados.cards.maquinasAtivas);
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
    const url = setorId ? `/api/setores/quantidade_por_setor?setorId=${setorId}` : "/api/setores/obterQuantidadeMaquinasPorSetor";
    const data = await apiFetch(url);
    return QtdMaquinaPorSetorArraySchema.parse(data.dados);
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
    const url = setorId ? `/api/setores/tempo_medio_parada?setorId=${setorId}` : "/api/setores/obterTempoMedioParadaPorSetor";
    const data = await apiFetch(url);
    return TempoMedioParadaArraySchema.parse(data.dados);
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
    const url = setorId ? `/api/setores/producao_defeitos?setorId=${setorId}` : "/api/setores/obterProducaoDefeitosPorSetor";
    const data = await apiFetch(url);
    return ProducaoDefeitoPorSetorArraySchema.parse(data.dados);
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
    const url = setorId ? `/api/turnos/status_por_turno?setorId=${setorId}` : "/api/turnos/status-maquinas-por-turno";
    const data = await apiFetch(url);
    return MaquinaPorTurnoArraySchema.parse(data.dados);
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
    return ProducaoTotalArraySchema.parse(data.dados);
  },
};
