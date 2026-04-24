import { apiFetch } from "./api";
import {
  MotivoRefugoArraySchema,
  MotivoSetupArraySchema,
  OEEMaquinaSchema,
  OEEEvolucaoArraySchema,
  VelocidadeArraySchema,
} from "@features/maquinas/schemas/maquinaDetalheSchema";
import {
  mockMotivoRefugoMaquina,
  mockMotivoSetupMaquina,
  mockOEEMaquina,
  mockOEEEvolucaoMaquina,
  mockVelocidadeMaquina,
} from "./mockData";

const USE_MOCK = true;

export const motivoRefugoMaquinaService = {
  async getMotivos(maquinaId) {
    if (USE_MOCK) return MotivoRefugoArraySchema.parse(mockMotivoRefugoMaquina);
    const data = await apiFetch(`/maquinas/${maquinaId}/refugo_motivos`);
    return MotivoRefugoArraySchema.parse(data);
  },
};

export const motivoSetupMaquinaService = {
  async getMotivos(maquinaId) {
    if (USE_MOCK) return MotivoSetupArraySchema.parse(mockMotivoSetupMaquina);
    const data = await apiFetch(`/maquinas/${maquinaId}/setup_motivos`);
    return MotivoSetupArraySchema.parse(data);
  },
};

export const oeeMaquinaService = {
  async getOEE(maquinaId) {
    if (USE_MOCK) return OEEMaquinaSchema.parse(mockOEEMaquina);
    const data = await apiFetch(`/maquinas/${maquinaId}/oee`);
    return OEEMaquinaSchema.parse(data);
  },
};

export const oeeEvolucaoMaquinaService = {
  async getEvolucao(maquinaId) {
    if (USE_MOCK) return OEEEvolucaoArraySchema.parse(mockOEEEvolucaoMaquina);
    const data = await apiFetch(`/maquinas/${maquinaId}/oee_evolucao`);
    return OEEEvolucaoArraySchema.parse(data);
  },
};

export const velocidadeMaquinaService = {
  async getVelocidade(maquinaId) {
    if (USE_MOCK) return VelocidadeArraySchema.parse(mockVelocidadeMaquina);
    const data = await apiFetch(`/maquinas/${maquinaId}/velocidade`);
    return VelocidadeArraySchema.parse(data);
  },
};