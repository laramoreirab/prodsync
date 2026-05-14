import { apiFetch } from "@/lib/api";
import {
  MotivoRefugoArraySchema,
  MotivoSetupArraySchema,
  OEEMaquinaSchema,
  OEEEvolucaoArraySchema,
  VelocidadeArraySchema,
} from "@features/maquinas/schemas/maquinaDetalheSchema";

export const motivoRefugoMaquinaService = {
  async getMotivos(maquinaId) {
    const data = await apiFetch(`/api/maquinas/${maquinaId}/refugo_motivos`);
    const refugos = data.dados?.por_ordem || [];
    return MotivoRefugoArraySchema.parse(
      refugos.map((item) => ({
        name: item.produto || item.codigo_lote || `OP ${item.id_ordem}`,
        value: item.qtd_refugo || 0,
      }))
    );
  },
};

export const motivoSetupMaquinaService = {
  async getMotivos(maquinaId) {
    const data = await apiFetch(`/api/maquinas/${maquinaId}/setup_motivos`);
    return MotivoSetupArraySchema.parse(
      (data.dados || []).map((item) => ({
        motivo: item.descricao || "Sem motivo informado",
        minutos: item.duracao_total_minutos || 0,
      }))
    );
  },
};

export const oeeMaquinaService = {
  async getOEE(maquinaId) {
    const data = await apiFetch(`/api/oee/maquinas/${maquinaId}`);
    return OEEMaquinaSchema.parse(data.dados);
  },
};

export const oeeEvolucaoMaquinaService = {
  async getEvolucao(maquinaId) {
    const data = await apiFetch(`/api/oee/maquinas/${maquinaId}/evolucao`);
    const listaOriginal = data.dados || [];
    const dadosFormatados = listaOriginal.map((item) => {
      const dataObj = new Date(item.data);
      return {
        dia: dataObj.toLocaleDateString("pt-BR", {
          day: "numeric",
          month: "short",
        }),
        oee: item.oee,
      };
    });
    return OEEEvolucaoArraySchema.parse(dadosFormatados);
  },
};

export const velocidadeMaquinaService = {
  async getVelocidade(maquinaId) {
    const data = await apiFetch(`/api/maquinas/${maquinaId}/velocidade`);
    return VelocidadeArraySchema.parse([
      { tipo: "Velocidade Padrão", valor: data.dados.velocidade_padrao || 0 },
      { tipo: "Velocidade Atual", valor: data.dados.velocidade_atual || 0 },
    ]);
  },
};
