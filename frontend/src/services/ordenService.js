import { apiFetch } from "@/lib/api";
import { opCrudService } from "@/services/opCrudService";
import {
  OPKPISchema,
  OPEficienciaSchema,
  OPRefugoArraySchema,
  OPCargaSetorArraySchema,
  OPStatusArraySchema,
  OPConcluidasDiaArraySchema,
  OPProgressoSchema,
  OPOEEDetalheSchema,
} from "@features/ordens/schemas/ordenSchema";
import {
  mockOPAtivasKPI,
  mockOPAtrasadasKPI,
  mockOPPecasBoas,
  mockOPRefugoKPI,
  mockOPEficiencia,
  mockOPTopRefugo,
  mockOPCargaSetor,
  mockOPStatus,
  mockOPConcluidasDia,
} from "./mockData";

const USE_MOCK = false;

function withSetorId(url, setorId = null) {
  if (!setorId) return url;
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}setorId=${encodeURIComponent(setorId)}`;
}

export const opAtivasService = {
  async getKPI(setorId = null) {
    if (USE_MOCK) return OPKPISchema.parse(mockOPAtivasKPI);
    try {
      const response = await apiFetch(withSetorId("/api/ordens/kpi/ativas", setorId));
      return OPKPISchema.parse({
        titulo: "OPs Ativas",
        valor: response.resultado,
      });
    } catch (error) {
      console.error("Erro ao buscar OPs ativas:", error);
    }
  },
};

export const opAtrasadasService = {
  async getKPI(setorId = null) {
    if (USE_MOCK) return OPKPISchema.parse(mockOPAtrasadasKPI);
    try {
      const response = await apiFetch(withSetorId("/api/ordens/kpi/atrasadas", setorId));
      return OPKPISchema.parse({
        titulo: "OPs Atrasadas",
        valor: response.resultado,
      });
    } catch (error) {
      console.error("Erro ao buscar OPs atrasadas:", error);
    }
  },
};

export const opPecasBoasService = {
  async getKPI(setorId = null) {
    if (USE_MOCK) return OPKPISchema.parse(mockOPPecasBoas);
    try {
      const response = await apiFetch(withSetorId("/api/ordens/kpi/pecas-boas", setorId));
      return OPKPISchema.parse({
        titulo: "Peças Boas",
        valor: response.resultado._sum.qtd_boa || 0,
      });
    } catch (error) {
      console.error("Erro ao buscar peças boas:", error);
    }
  },
};

export const opRefugoKPIService = {
  async getKPI(setorId = null) {
    if (USE_MOCK) return OPKPISchema.parse(mockOPRefugoKPI);
    try {
      const response = await apiFetch(withSetorId("/api/ordens/kpi/refugo", setorId));
      return OPKPISchema.parse({
        titulo: "Refugo Total",
        valor: response.resultado._sum.qtd_refugo || 0,
      });
    } catch (error) {
      console.error("Erro ao buscar refugo:", error);
    }
  },
};

export const opEficienciaService = {
  async getEficiencia(setorId = null) {
    if (USE_MOCK) return OPEficienciaSchema.parse(mockOPEficiencia);
    try {
      const response = await apiFetch(withSetorId("/api/ordens/dashboard/eficiencia", setorId));
      return OPEficienciaSchema.parse(response.dados);
    } catch (error) {
      console.error("Erro ao buscar eficiência:", error);
    }
  },
};

export const opTopRefugoService = {
  async getTopRefugo(setorId = null) {
    if (USE_MOCK) return OPRefugoArraySchema.parse(mockOPTopRefugo);
    try {
      const response = await apiFetch(withSetorId("/api/ordens/dashboard/top-refugo", setorId));
      const dados = (response.dados || []).map((item) => ({
        op: item.label,
        refugo: item.qtd_refugo,
      }));
      return OPRefugoArraySchema.parse(dados);
    } catch (error) {
      console.error("Erro ao buscar top refugo:", error);
    }
  },
};

export const opCargaSetorService = {
  async getCargaSetor(setorId = null) {
    if (USE_MOCK) return OPCargaSetorArraySchema.parse(mockOPCargaSetor);
    try {
      const response = await apiFetch(withSetorId("/api/ordens/dashboard/carga-setor", setorId));
      const dados = (response.dados || []).map((item) => {
        const carga = item.carga_restante ?? item.qtd_ops ?? 0;

        return {
          setor: item.setor,
          carga,
        };
      });
      return OPCargaSetorArraySchema.parse(dados);
    } catch (error) {
      console.error("Erro ao buscar carga por setor:", error);
    }
  },
};

export const opStatusService = {
  async getStatus(setorId = null) {
    if (USE_MOCK) return OPStatusArraySchema.parse(mockOPStatus);
    try {
      const response = await apiFetch(withSetorId("/api/ordens/dashboard/status", setorId));
      const dados = (response.dados || []).map((item) => ({
        name: item.status,
        value: item.quantidade,
      }));
      return OPStatusArraySchema.parse(dados);
    } catch (error) {
      console.error("Erro ao buscar status das OPs:", error);
    }
  },
};

export const opConcluidasDiaService = {
  async getConcluidasDia(setorId = null) {
    if (USE_MOCK) return OPConcluidasDiaArraySchema.parse(mockOPConcluidasDia);
    try {
      const response = await apiFetch(withSetorId("/api/ordens/dashboard/concluidas-dia", setorId));
      const dados = (response.dados || []).map((item) => ({
        dia: item.dia,
        total: item.ops_concluidas,
      }));
      return OPConcluidasDiaArraySchema.parse(dados);
    } catch (error) {
      console.error("Erro ao buscar OPs concluídas por dia:", error);
    }
  },
};

const extrairProgressoOP = (dados) => {
  const itens = Array.isArray(dados) ? dados : [];
  const produzido = itens.find((i) => i.nome === "Produzidos") ?? itens[0];
  const aProduzir = itens.find((i) => i.nome === "A Produzir") ?? itens[1];

  return OPProgressoSchema.parse({
    produzidos: Number(produzido?.valor ?? 0),
    aProduzir: Number(aProduzir?.valor ?? 0),
  });
};

const extrairOeeOP = (dados) =>
  OPOEEDetalheSchema.parse({
    disponibilidade: Number(dados?.disponibilidade ?? 0),
    performance: Number(dados?.performance ?? 0),
    qualidade: Number(dados?.qualidade ?? 0),
    oee: Number(dados?.oee ?? 0),
  });

export const opProgressoService = {
  async getProgresso(opId) {
    const response = await apiFetch(`/api/ordens/dashboard/progresso/${opId}`);
    return extrairProgressoOP(response?.dados);
  },
};

export const opOEEDetalheService = {
  async getOEE(opId, maquinaId) {
    let id_maquina = maquinaId;

    if (!id_maquina) {
      const op = await opCrudService.getById(opId);
      id_maquina =
        op?.id_maquina ??
        op?.maquina?.id_maquina ??
        op?.maquina?.id ??
        op?.maquina_id;
    }

    if (!id_maquina) {
      return extrairOeeOP(null);
    }

    const response = await apiFetch(`/api/oee/maquinas/${id_maquina}/ordens/${opId}`);
    return extrairOeeOP(response?.dados);
  },
};
