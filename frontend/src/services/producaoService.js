import { apiFetch } from "@/lib/api";
import {
  OEESchema,
  ProducaoPorHoraArraySchema,
  ProducaoPorSetorArraySchema,
  PecasPorMinutoSchema,
  ProducaoPorTurnoLotesSchema,
} from "@features/producao/schemas/producaoSchema";

export const producaoService = {
  async getPorHora() {
    const data = await apiFetch("/api/dashboard/producao-dia");
    return ProducaoPorHoraArraySchema.parse(data.dados);
  },

  async getPorSetor() {
    const data = await apiFetch("/api/setores/obterProducaoPorSetor");
    return ProducaoPorSetorArraySchema.parse(data.dados);
  },

  async getOEE() {
    const data = await apiFetch("/api/oee/geral");
    return OEESchema.parse(data.dados);
  },
};

export const pecasPorMinutosService = {
  async getPecasPorMinuto(setorId = null) {
    const query = setorId ? `?setorId=${encodeURIComponent(setorId)}` : "";
    const data = await apiFetch(`/api/maquinas/dashboard/obter-pecas-por-minuto${query}`);
    return PecasPorMinutoSchema.parse(data.dados);
  },
};

export const producaoPorTurnoLotesService = {
  async getProducaoPorTurnoLotes(setorId = null) {
    const query = setorId ? `?setorId=${encodeURIComponent(setorId)}` : "";
    const data = await apiFetch(`/api/turnos/kpis/turno-atual${query}`);
    return ProducaoPorTurnoLotesSchema.parse(data.dados.cards.producaoLotes);
  },
};
