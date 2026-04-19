import { apiFetch } from "./api";
import { MaquinaStatusArraySchema } from "@features/maquinas/schemas/maquinaStatusSchema";
import { MaquinaAtivaPorTurnoSchema } from "@features/maquinas/schemas/maquinaStatusSchema";
import { mockMaquinaStatus } from "./mockData";
import { mockMaquinaAtivaPorTurno } from "./mockData";
const USE_MOCK = true;

export const maquinaStatusService = {
  async getStatus() {
    if (USE_MOCK) return MaquinaStatusArraySchema.parse(mockMaquinaStatus);
    const data = await apiFetch("/maquinas/status");
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