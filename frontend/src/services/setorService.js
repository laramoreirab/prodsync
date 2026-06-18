import { apiFetch } from "@/lib/api";
import {
  SetorArraySchema,
  SetorKPISchema,
  OEEPorSetorArraySchema,
  RefugoPorSetorArraySchema,
  OEECriticoSchema,
  SetorMaquinaStatusSchema,
  SetorOEEMedioSchema,
  SetorOEEEvolucaoArraySchema,
  SetorOEEPanelSchema,
  SetorTopOperadoresArraySchema,
  SetorMotivosParadaArraySchema,
  SetorProducaoSemanalArraySchema,
  SetorProducaoMaquinaArraySchema,
  SetorProducaoDiariaArraySchema,
} from "@features/setores/schemas/setorSchema";

const labelOrFallback = (value, fallback) => {
  const label = String(value ?? "").trim();
  return label || fallback;
};

export const setorService = {
  async getSetores() {
    const data = await apiFetch("/api/setores/empresa");
    return SetorArraySchema.parse(data.dados);
  },
};

export const setorTotalKPIService = {
  async getKPI() {
    const data = await apiFetch("/api/setores/totalSetores");
    return SetorKPISchema.parse(data.dados);
  },
};

export const operadoresMediaKPIService = {
  async getKPI() {
    const data = await apiFetch("/api/setores/obterQuantidadeOperadoresPorSetor");
    if (!data.dados || typeof data.dados !== "object") return [];
    return SetorKPISchema.parse(data.dados);
  },
};

export const oeeSetorService = {
  async getOEEPorSetor() {
    const data = await apiFetch("/api/oee/setores/media");
    const normalized = (data.dados || []).map((item) => ({
      ...item,
      setor: labelOrFallback(item.setor, "Sem setor"),
    }));
    return OEEPorSetorArraySchema.parse(normalized);
  },
};

export const refugoSetorService = {
  async getRefugoPorSetor() {
    const listaDados = await apiFetch("/api/setores/obterProducaoDefeitosPorSetor");
    const dadosOriginais = listaDados.dados || [];
    const data = dadosOriginais.map((item) => ({
      setor: labelOrFallback(item.setor, "Sem setor"),
      refugo: item.defeito,
    }));
    return RefugoPorSetorArraySchema.parse(data);
  },
};

export const oeeCriticoService = {
  async getOEECritico() {
    const data = await apiFetch("/api/oee/setores/critico");
    if (!data.dados) return [];
    return OEECriticoSchema.parse(data.dados);
  },
};

export const setorMaquinaStatusService = {
  async getStatus(setorId) {
    const data = await apiFetch(`/api/maquinas/setor/${setorId}`);
    const maquinas = data.dados || [];
    return SetorMaquinaStatusSchema.parse({
      emProducao: maquinas.filter((maquina) => (maquina.status_atual || maquina.status) === "Produzindo").length,
      emSetup: maquinas.filter((maquina) => (maquina.status_atual || maquina.status) === "Setup").length,
      emParada: maquinas.filter((maquina) => (maquina.status_atual || maquina.status) === "Parada").length,
    });
  },
};

export const setorOEEMedioService = {
  async getOEE(setorId) {
    const data = await apiFetch(`/api/oee/setores/${setorId}`);
    return SetorOEEMedioSchema.parse({
      ...data.dados,
      setor: labelOrFallback(data.dados?.setor, "Sem setor"),
    });
  },
};

export const setorOEEEvolucaoService = {
  async getEvolucao(setorId) {
    const data = await apiFetch(`/api/oee/evolucaoOEEsetor/${setorId}`);
    return SetorOEEEvolucaoArraySchema.parse(data.dados);
  },
};

export const setorTopOperadoresService = {
  async getTopOperadores(setorId) {
    const data = await apiFetch(`/api/setores/top5operadoresPorSetor/${setorId}`);
    const normalized = (data.dados || []).map((item) => ({
      ...item,
      operador: labelOrFallback(item.operador, "Sem nome"),
    }));
    return SetorTopOperadoresArraySchema.parse(normalized);
  },
};

export const setorMotivosParadaService = {
  async getMotivos(setorId) {
    const data = await apiFetch(`/api/setores/motivosParada/${setorId}`);
    const normalized = (data.dados || []).map((item) => ({
      ...item,
      motivo: labelOrFallback(item.motivo, "Sem motivo"),
    }));
    return SetorMotivosParadaArraySchema.parse(normalized);
  },
};

export const setorProducaoSemanalService = {
  async getProducaoSemanal(setorId) {
    const data = await apiFetch(`/api/maquinas/dashboard/pecasProduzidas7dias/${setorId}`);
    return SetorProducaoSemanalArraySchema.parse(data.dados);
  },
};

export const setorProducaoMaquinaService = {
  async getProducaoPorMaquina(setorId) {
    const data = await apiFetch(`/api/maquinas/producaoMaquinas/${setorId}`);
    const normalized = (data.dados || []).map((item) => ({
      ...item,
      maquina: labelOrFallback(item.maquina, "Sem máquina"),
    }));
    return SetorProducaoMaquinaArraySchema.parse(normalized);
  },
};

export const setorProducaoDiariaService = {
  async getProducaoDiaria(setorId) {
    const query = setorId ? `?setorId=${encodeURIComponent(setorId)}` : "";
    const data = await apiFetch(`/api/dashboard/producao-dia${query}`);
    return SetorProducaoDiariaArraySchema.parse(data.dados);
  },
};

export const setorOEEPanelService = {
  async getOEEPanel(setorId) {
    const data = await apiFetch(`/api/oee/setores/${setorId}`);
    const dados = data.dados || {};
    return SetorOEEPanelSchema.parse({
      disponibilidade: dados.disponibilidade ?? dados.oee ?? 0,
      performance: dados.performance ?? dados.oee ?? 0,
      qualidade: dados.qualidade ?? dados.oee ?? 0,
      oee: dados.oee ?? 0,
    });
  },
};
