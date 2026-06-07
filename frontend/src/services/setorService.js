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
import {
  mockSetorProducaoDiaria,
  mockSetorOEEPanel,
} from "./mockData";
// import {
//   mockSetores,
//   mockSetorTotalKPI,
//   mockOperadoresMediaKPI,
//   mockOEEPorSetor,
//   mockRefugoPorSetor,
//   mockOEECritico,
//   mockSetorProducaoSemanal,
//   mockProducaoPorMaquinaSetor 
// } from "./mockData";
//  import {
//     mockSetorMaquinaStatus,
//     mockSetorOEEMedio,
//     mockSetorOEEEvolucao,
//     mockSetorTopOperadores,
//     mockSetorMotivosParada,
//   } from "./mockData";

const USE_MOCK = false;

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
    return OEEPorSetorArraySchema.parse(data.dados);
  },
};

export const refugoSetorService = {
  async getRefugoPorSetor() {
    const listaDados = await apiFetch("/api/setores/obterProducaoDefeitosPorSetor");
    const dadosOriginais = listaDados.dados || [];
    const data = dadosOriginais.map((item) => ({
      setor: item.setor,
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
    return SetorOEEMedioSchema.parse(data.dados);
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
    return SetorTopOperadoresArraySchema.parse(data.dados);
  },
};

export const setorMotivosParadaService = {
  async getMotivos(setorId) {
    const data = await apiFetch(`/api/setores/motivosParada/${setorId}`);
    return SetorMotivosParadaArraySchema.parse(data.dados);
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
    return SetorProducaoMaquinaArraySchema.parse(data.dados);
  },
};

export const setorProducaoDiariaService = {
  async getProducaoDiaria(setorId) {
    if (USE_MOCK) return SetorProducaoDiariaArraySchema.parse(mockSetorProducaoDiaria);
    try {
      const data = await apiFetch(`/api/maquinas/dashboard/producaoDiariaSetor/${setorId}`);
      return SetorProducaoDiariaArraySchema.parse(data.dados);
    } catch {
      return SetorProducaoDiariaArraySchema.parse(mockSetorProducaoDiaria);
    }
  },
};

export const setorOEEPanelService = {
  async getOEEPanel(setorId) {
    if (USE_MOCK) return SetorOEEPanelSchema.parse(mockSetorOEEPanel);
    try {
      const data = await apiFetch(`/api/oee/setores/${setorId}`);
      const dados = data.dados || {};
      return SetorOEEPanelSchema.parse({
        disponibilidade: dados.disponibilidade ?? dados.oee ?? 0,
        performance: dados.performance ?? dados.oee ?? 0,
        qualidade: dados.qualidade ?? dados.oee ?? 0,
        oee: dados.oee ?? 0,
      });
    } catch {
      return SetorOEEPanelSchema.parse(mockSetorOEEPanel);
    }
  },
};
