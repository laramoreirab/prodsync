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

export const opAtivasService = {
  async getKPI() {
    if (USE_MOCK) return OPKPISchema.parse(mockOPAtivasKPI);
    try {
      const response = await apiFetch("/api/ordens/kpi/ativas");
      return OPKPISchema.parse({
        titulo: "OPs Ativas",
        valor: response.resultado
      });
    } catch (error) {
      console.error('Erro ao buscar OPs ativas:', error);
    }
  },
};

export const opAtrasadasService = {
  async getKPI() {
    if (USE_MOCK) return OPKPISchema.parse(mockOPAtrasadasKPI);
    try {
      const response = await apiFetch("/api/ordens/kpi/atrasadas");
      return OPKPISchema.parse({
        titulo: "OPs Atrasadas",
        valor: response.resultado
      });
    } catch (error) {
      console.error('Erro ao buscar OPs atrasadas:', error);
    }
  },
};

export const opPecasBoasService = {
  async getKPI() {
    if (USE_MOCK) return OPKPISchema.parse(mockOPPecasBoas);
    try {
      const response = await apiFetch("/api/ordens/kpi/pecas-boas");
      return OPKPISchema.parse({
        titulo: "Peças Boas",
        valor: response.resultado._sum.qtd_boa || 0
      });
    } catch (error) {
      console.error('Erro ao buscar peças boas:', error);
    }
  },
};

export const opRefugoKPIService = {
  async getKPI() {
    if (USE_MOCK) return OPKPISchema.parse(mockOPRefugoKPI);
    try {
      const response = await apiFetch("/api/ordens/kpi/refugo");
      return OPKPISchema.parse({
        titulo: "Refugo Total",
        valor: response.resultado._sum.qtd_refugo || 0
      });
    } catch (error) {
      console.error('Erro ao buscar refugo:', error);
    }
  },
};

export const opEficienciaService = {
  async getEficiencia() {
    if (USE_MOCK) return OPEficienciaSchema.parse(mockOPEficiencia);
    try {
      const response = await apiFetch("/api/ordens/dashboard/eficiencia");
      return OPEficienciaSchema.parse(response.dados);
    } catch (error) {
      console.error('Erro ao buscar eficiência:', error);
    }
  },
};

export const opTopRefugoService = {
  async getTopRefugo() {
    if (USE_MOCK) return OPRefugoArraySchema.parse(mockOPTopRefugo);
    try {
      const response = await apiFetch("/api/ordens/dashboard/top-refugo");
      const dados = response.dados.map(item => ({
        op: item.label,
        refugo: item.qtd_refugo
      }));
      return OPRefugoArraySchema.parse(dados);
    } catch (error) {
      console.error('Erro ao buscar top refugo:', error);
    }
  },
};

export const opCargaSetorService = {
  async getCargaSetor() {
    if (USE_MOCK) return OPCargaSetorArraySchema.parse(mockOPCargaSetor);
    try {
      const response = await apiFetch("/api/ordens/dashboard/carga-setor");
      const dados = response.dados.map(item => ({
        setor: item.setor,
        carga: item.qtd_ops
      }));
      return OPCargaSetorArraySchema.parse(dados);
    } catch (error) {
      console.error('Erro ao buscar carga por setor:', error);
    }
  },
};

export const opStatusService = {
  async getStatus() {
    if (USE_MOCK) return OPStatusArraySchema.parse(mockOPStatus);
    try {
      const response = await apiFetch("/api/ordens/dashboard/status");
      const dados = response.dados.map(item => ({
        name: item.status,
        value: item.quantidade
      }));
      return OPStatusArraySchema.parse(dados);
    } catch (error) {
      console.error('Erro ao buscar status das OPs:', error);
    }
  },
};

export const opConcluidasDiaService = {
  async getConcluidasDia() {
    if (USE_MOCK) return OPConcluidasDiaArraySchema.parse(mockOPConcluidasDia);
    try {
      const response = await apiFetch("/api/ordens/dashboard/concluidas-dia");
      const dados = response.dados.map(item => ({
        dia: item.dia,
        total: item.ops_concluidas
      }));
      return OPConcluidasDiaArraySchema.parse(dados);
    } catch (error) {
      console.error('Erro ao buscar OPs concluídas por dia:', error);
    }
  },
};
 
export const opProgressoService = {
  async getProgresso(opId) {
    if (USE_MOCK) return OPProgressoSchema.parse(mockOPProgresso);
    try {
      const response = await apiFetch(`/api/ordens/dashboard/progresso/${opId}`);
      const [produzido, aProduzir] = response.dados;
      return OPProgressoSchema.parse({
        produzidos: produzido.valor,
        aProduzir: aProduzir.valor
      });
    } catch (error) {
      console.error('Erro ao buscar progresso da OP:', error);
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
        const opResponse = await apiFetch(`/api/ordens?pagina=1&limite=50`);
        const op = opResponse.dados?.find(o => o.id_ordem === Number(opId));
        id_maquina = op?.id_maquina;
      }

      if (!id_maquina) {
        console.warn(`Não foi possível encontrar a máquina para a OP ${opId}`);
      }

      const response = await apiFetch(`/api/oee/maquinas/${id_maquina}/ordens/${opId}`);
      return OPOEEDetalheSchema.parse(response.dados);
    } catch (error) {
      console.error('Erro ao buscar OEE da OP:', error);
    }
  },
};