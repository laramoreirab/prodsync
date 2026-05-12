import { apiFetch } from "@/lib/api"
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

const USE_MOCK = false;

export const motivoRefugoMaquinaService = {
  async getMotivos(maquinaId) {
    if (USE_MOCK) return MotivoRefugoArraySchema.parse(mockMotivoRefugoMaquina);
    const data = await apiFetch(`/api/maquinas/${maquinaId}/refugo_motivos`);
    const refugos = data.dados?.por_ordem || [];
    return MotivoRefugoArraySchema.parse(refugos.map((item) => ({
      name: item.produto || item.codigo_lote || `OP ${item.id_ordem}`,
      value: item.qtd_refugo || 0,
    })));
  },
};

export const motivoSetupMaquinaService = {
  async getMotivos(maquinaId) {
    if (USE_MOCK) return MotivoSetupArraySchema.parse(mockMotivoSetupMaquina);
    const data = await apiFetch(`/api/maquinas/${maquinaId}/setup_motivos`);
    return MotivoSetupArraySchema.parse((data.dados || []).map((item) => ({
      motivo: item.descricao || "Sem motivo informado",
      minutos: item.duracao_total_minutos || 0,
    })));
  },
};

export const oeeMaquinaService = {
  async getOEE(maquinaId) {
    if (USE_MOCK) return OEEMaquinaSchema.parse(mockOEEMaquina);
    const data = await apiFetch(`/api/oee/maquinas/${maquinaId}`);
    return OEEMaquinaSchema.parse(data.dados);
  },
};

export const oeeEvolucaoMaquinaService = {
  async getEvolucao(maquinaId) {
    if (USE_MOCK) return OEEEvolucaoArraySchema.parse(mockOEEEvolucaoMaquina);
    const data = await apiFetch(`/api/oee/maquinas/${maquinaId}/evolucao`);
    return OEEEvolucaoArraySchema.parse((data.dados || []).map((item) => ({
      dia: item.data,
      oee: item.oee,
    })));
  },
};

export const velocidadeMaquinaService = {
  async getVelocidade(maquinaId) {
    if (USE_MOCK) return VelocidadeArraySchema.parse(mockVelocidadeMaquina);
    const data = await apiFetch(`/api/maquinas/${maquinaId}/velocidade`);
    return VelocidadeArraySchema.parse([
      { tipo: "Velocidade Padrão", valor: data.dados?.velocidade_padrao || 0 },
      { tipo: "Velocidade Atual", valor: data.dados?.velocidade_atual || 0 },
    ]);
  },
};
