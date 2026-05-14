import { apiFetch } from "@/lib/api"
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
  mockOPProgresso,
  mockOPOEEDetalhe,
} from "./mockData";

const USE_MOCK = false;

function withSetorId(path, setorId) {
  return setorId ? `${path}?setorId=${encodeURIComponent(setorId)}` : path;
}

export const opAtivasService = {
  async getKPI(setorId = null) {
    if (USE_MOCK) return OPKPISchema.parse(mockOPAtivasKPI);
    try {
      const response = await apiFetch("/ordens/kpi/ativas");
      return OPKPISchema.parse({
        titulo: "OPs Ativas",
        valor: response.resultado
      });
    } catch (error) {
      console.error('Erro ao buscar OPs ativas:', error);
      return OPKPISchema.parse(mockOPAtivasKPI);
    }
  },
};

export const opAtrasadasService = {
  async getKPI(setorId = null) {
    if (USE_MOCK) return OPKPISchema.parse(mockOPAtrasadasKPI);
    try {
      const response = await apiFetch("/ordens/kpi/atrasadas");
      return OPKPISchema.parse({
        titulo: "OPs Atrasadas",
        valor: response.resultado
      });
    } catch (error) {
      console.error('Erro ao buscar OPs atrasadas:', error);
      return OPKPISchema.parse(mockOPAtrasadasKPI);
    }
  },
};

export const opPecasBoasService = {
  async getKPI(setorId = null) {
    if (USE_MOCK) return OPKPISchema.parse(mockOPPecasBoas);
    try {
      const response = await apiFetch("/ordens/kpi/pecas-boas");
      return OPKPISchema.parse({
        titulo: "Peças Boas",
        valor: response.resultado._sum.qtd_boa || 0
      });
    } catch (error) {
      console.error('Erro ao buscar peças boas:', error);
      return OPKPISchema.parse(mockOPPecasBoas);
    }
  },
};

export const opRefugoKPIService = {
  async getKPI(setorId = null) {
    if (USE_MOCK) return OPKPISchema.parse(mockOPRefugoKPI);
    try {
      const response = await apiFetch("/ordens/kpi/refugo");
      return OPKPISchema.parse({
        titulo: "Refugo Total",
        valor: response.resultado._sum.qtd_refugo || 0
      });
    } catch (error) {
      console.error('Erro ao buscar refugo:', error);
      return OPKPISchema.parse(mockOPRefugoKPI);
    }
  },
};

export const opEficienciaService = {
  async getEficiencia(setorId = null) {
    if (USE_MOCK) return OPEficienciaSchema.parse(mockOPEficiencia);
    try {
      const response = await apiFetch("/ordens/dashboard/eficiencia");
      return OPEficienciaSchema.parse(response.dados);
    } catch (error) {
      console.error('Erro ao buscar eficiência:', error);
      return OPEficienciaSchema.parse(mockOPEficiencia);
    }
  },
};

export const opTopRefugoService = {
  async getTopRefugo(setorId = null) {
    if (USE_MOCK) return OPRefugoArraySchema.parse(mockOPTopRefugo);
    try {
      const response = await apiFetch("/ordens/dashboard/top-refugo");
      const dados = response.dados.map(item => ({
        op: item.label,
        refugo: item.qtd_refugo
      }));
      return OPRefugoArraySchema.parse(dados);
    } catch (error) {
      console.error('Erro ao buscar top refugo:', error);
      return OPRefugoArraySchema.parse(mockOPTopRefugo);
    }
  },
};

export const opCargaSetorService = {
  async getCargaSetor(setorId = null) {
    if (USE_MOCK) return OPCargaSetorArraySchema.parse(mockOPCargaSetor);
    try {
      const response = await apiFetch("/ordens/dashboard/carga-setor");
      const dados = response.dados.map(item => ({
        setor: item.setor,
        carga: item.qtd_ops
      }));
      return OPCargaSetorArraySchema.parse(dados);
    } catch (error) {
      console.error('Erro ao buscar carga por setor:', error);
      return OPCargaSetorArraySchema.parse(mockOPCargaSetor);
    }
  },
};

export const opStatusService = {
  async getStatus(setorId = null) {
    if (USE_MOCK) return OPStatusArraySchema.parse(mockOPStatus);
    try {
      const response = await apiFetch("/ordens/dashboard/status");
      const dados = response.dados.map(item => ({
        name: item.status,
        value: item.quantidade
      }));
      return OPStatusArraySchema.parse(dados);
    } catch (error) {
      console.error('Erro ao buscar status das OPs:', error);
      return OPStatusArraySchema.parse(mockOPStatus);
    }
  },
};

export const opConcluidasDiaService = {
  async getConcluidasDia(setorId = null) {
    if (USE_MOCK) return OPConcluidasDiaArraySchema.parse(mockOPConcluidasDia);
    try {
      const response = await apiFetch("/ordens/dashboard/concluidas-dia");
      const dados = response.dados.map(item => ({
        dia: item.dia,
        total: item.ops_concluidas
      }));
      return OPConcluidasDiaArraySchema.parse(dados);
    } catch (error) {
      console.error('Erro ao buscar OPs concluídas por dia:', error);
      return OPConcluidasDiaArraySchema.parse(mockOPConcluidasDia);
    }
  },
};
 
export const opProgressoService = {
  async getProgresso(opId) {
    if (USE_MOCK) return OPProgressoSchema.parse(mockOPProgresso);
    try {
      const response = await apiFetch(`/ordens/dashboard/progresso/${opId}`);
      const [produzido, aProduzir] = response.dados;
      return OPProgressoSchema.parse({
        produzidos: produzido.valor,
        aProduzir: aProduzir.valor
      });
    } catch (error) {
      console.error('Erro ao buscar progresso da OP:', error);
      return OPProgressoSchema.parse(mockOPProgresso);
    }
  },
};
 
export const opOEEDetalheService = {
  async getOEE(opId, maquinaId) {
    if (USE_MOCK) return OPOEEDetalheSchema.parse(mockOPOEEDetalhe);
    try {
      // Se não tiver maquinaId, precisamos buscar a OP primeiro para descobrir a máquina
      let id_maquina = maquinaId;
      if (!id_maquina) {
        const opResponse = await apiFetch(`/ordens?pagina=1&limite=50`);
        const op = opResponse.dados?.find(o => o.id_ordem === Number(opId));
        id_maquina = op?.id_maquina;
      }

      if (!id_maquina) {
        console.warn(`Não foi possível encontrar a máquina para a OP ${opId}`);
        return OPOEEDetalheSchema.parse(mockOPOEEDetalhe);
      }

      const response = await apiFetch(`/oee/maquinas/${id_maquina}/ordens/${opId}`);
      return OPOEEDetalheSchema.parse(response.dados);
    } catch (error) {
      console.error('Erro ao buscar OEE da OP:', error);
      return OPOEEDetalheSchema.parse(mockOPOEEDetalhe);
    }
  },
};
