import { apiFetch } from "@/lib/api";
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

export const opAtivasService = {
  async getKPI() {
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