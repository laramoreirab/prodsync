import { apiFetch } from "./api";
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

const USE_MOCK = true;

export const opAtivasService = {
  async getKPI() {
    if (USE_MOCK) return OPKPISchema.parse(mockOPAtivasKPI);
    const data = await apiFetch("/ordens/ativas_kpi");
    return OPKPISchema.parse(data);
  },
};

export const opAtrasadasService = {
  async getKPI() {
    if (USE_MOCK) return OPKPISchema.parse(mockOPAtrasadasKPI);
    const data = await apiFetch("/ordens/atrasadas_kpi");
    return OPKPISchema.parse(data);
  },
};

export const opPecasBoasService = {
  async getKPI() {
    if (USE_MOCK) return OPKPISchema.parse(mockOPPecasBoas);
    const data = await apiFetch("/ordens/pecas_boas_kpi");
    return OPKPISchema.parse(data);
  },
};

export const opRefugoKPIService = {
  async getKPI() {
    if (USE_MOCK) return OPKPISchema.parse(mockOPRefugoKPI);
    const data = await apiFetch("/ordens/refugo_kpi");
    return OPKPISchema.parse(data);
  },
};

export const opEficienciaService = {
  async getEficiencia() {
    if (USE_MOCK) return OPEficienciaSchema.parse(mockOPEficiencia);
    const data = await apiFetch("/ordens/eficiencia");
    return OPEficienciaSchema.parse(data);
  },
};

export const opTopRefugoService = {
  async getTopRefugo() {
    if (USE_MOCK) return OPRefugoArraySchema.parse(mockOPTopRefugo);
    const data = await apiFetch("/ordens/top_refugo");
    return OPRefugoArraySchema.parse(data);
  },
};

export const opCargaSetorService = {
  async getCargaSetor() {
    if (USE_MOCK) return OPCargaSetorArraySchema.parse(mockOPCargaSetor);
    const data = await apiFetch("/ordens/carga_por_setor");
    return OPCargaSetorArraySchema.parse(data);
  },
};

export const opStatusService = {
  async getStatus() {
    if (USE_MOCK) return OPStatusArraySchema.parse(mockOPStatus);
    const data = await apiFetch("/ordens/status");
    return OPStatusArraySchema.parse(data);
  },
};

export const opConcluidasDiaService = {
  async getConcluidasDia() {
    if (USE_MOCK) return OPConcluidasDiaArraySchema.parse(mockOPConcluidasDia);
    const data = await apiFetch("/ordens/concluidas_por_dia");
    return OPConcluidasDiaArraySchema.parse(data);
  },
};
 
export const opProgressoService = {
  async getProgresso(opId) {
    if (USE_MOCK) return OPProgressoSchema.parse(mockOPProgresso);
    const data = await apiFetch(`/ordens/${opId}/progresso`);
    return OPProgressoSchema.parse(data);
  },
};
 
export const opOEEDetalheService = {
  async getOEE(opId) {
    if (USE_MOCK) return OPOEEDetalheSchema.parse(mockOPOEEDetalhe);
    const data = await apiFetch(`/ordens/${opId}/oee`);
    return OPOEEDetalheSchema.parse(data);
  },
};
 