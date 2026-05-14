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
    if (setorId) {
      const data = await apiFetch(`/api/maquinas/setor/${setorId}`);
      const maquinas = data.dados || [];
      const nomeSetor = maquinas[0]?.setor?.nome_setor || "Setor";
      return QtdMaquinaPorSetorArraySchema.parse([{ id: Number(setorId), setor: nomeSetor, quantidade: maquinas.length }]);
    }
    const data = await apiFetch("/api/setores/obterQuantidadeMaquinasPorSetor");
    const dados = (data.dados || []).map((item, index) => ({
      id: item.id_setor ?? item.id ?? index + 1,
      setor: item.setor,
      quantidade: item.quantidade ?? item.qtd ?? 0,
    }));
    return QtdMaquinaPorSetorArraySchema.parse(dados);
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
    const url = setorId ? `/api/setores/obterTempoMedioParadaPorSetor?setorId=${setorId}` : "/api/setores/obterTempoMedioParadaPorSetor";
    const data = await apiFetch(url);
    const dados = (data.dados || []).map((item) => ({
      maquina: item.maquina ?? item.setor,
      minutos: item.minutos,
      setorId: item.setorId ?? item.id_setor,
    }));
    return TempoMedioParadaArraySchema.parse(dados);
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
    const url = setorId ? `/api/setores/obterProducaoDefeitosPorSetor?setorId=${setorId}` : "/api/setores/obterProducaoDefeitosPorSetor";
    const data = await apiFetch(url);
    const dados = (data.dados || []).map((item) => ({
      maquina: item.maquina ?? item.setor,
      produzidas: item.produzidas,
      defeito: item.defeito,
      setorId: item.setorId ?? item.id_setor,
    }));
    return ProducaoDefeitoPorSetorArraySchema.parse(dados);
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
    const url = setorId ? `/api/turnos/status-maquinas-por-turno?setorId=${setorId}` : "/api/turnos/status-maquinas-por-turno";
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
      ? `/api/maquinas/dashboard/obter-producao-total-maquinas?periodo=${periodo}&setorId=${setorId}`
      : `/api/maquinas/dashboard/obter-producao-total-maquinas?periodo=${periodo}`;
    const data = await apiFetch(url);
    return ProducaoTotalArraySchema.parse(data.dados);
  },
};
