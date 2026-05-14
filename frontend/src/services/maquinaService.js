import { apiFetch } from "@/lib/api";
import {
  MaquinaStatusArraySchema,
  MaquinaAtivaPorTurnoSchema,
  QtdMaquinaPorSetorArraySchema,
  TempoMedioParadaArraySchema,
  ProducaoDefeitoPorSetorArraySchema,
  MaquinaPorTurnoArraySchema,
} from "@features/maquinas/schemas/maquinaStatusSchema";

export const maquinaStatusService = {
  async getStatus() {
    const data = await apiFetch("/api/maquinas/dashboard/status-geral");
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
  async getQtdPorSetor() {
    const data = await apiFetch("/api/setores/obterQuantidadeMaquinasPorSetor");
    return QtdMaquinaPorSetorArraySchema.parse(data.dados);
  },
};

export const tempoMedioParadaService = {
  async getTempoMedio() {
    const data = await apiFetch("/api/setores/obterTempoMedioParadaPorSetor");
    return TempoMedioParadaArraySchema.parse(data.dados);
  },
};

export const producaoDefeitosService = {
  async getProducaoDefeitos() {
    const data = await apiFetch("/api/setores/obterProducaoDefeitosPorSetor");
    return ProducaoDefeitoPorSetorArraySchema.parse(data.dados);
  },
};

export const maquinasPorTurnoService = {
  async getMaquinasPorTurno() {
    const data = await apiFetch("/api/turnos/status-maquinas-por-turno");
    return MaquinaPorTurnoArraySchema.parse(data.dados);
  },
};