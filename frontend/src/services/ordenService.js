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
  mockUSE_MOCK,
  mockOPOEEDetalhe,
} from "./mockData";

const USE_MOCK = true;

function withSetorId(path, setorId) {
  return setorId ? `${path}?setorId=${encodeURIComponent(setorId)}` : path;
}

export const opAtivasService = {
  async getKPI(setorId = null) {
    if (USE_MOCK) return OPKPISchema.parse(mockOPAtivasKPI);
    const data = await apiFetch(withSetorId("/ordens/ativas_kpi", setorId));
    return OPKPISchema.parse(data);
  },
};

export const opAtrasadasService = {
  async getKPI(setorId = null) {
    if (USE_MOCK) return OPKPISchema.parse(mockOPAtrasadasKPI);
    const data = await apiFetch(withSetorId("/ordens/atrasadas_kpi", setorId));
    return OPKPISchema.parse(data);
  },
};

export const opPecasBoasService = {
  async getKPI(setorId = null) {
    if (USE_MOCK) return OPKPISchema.parse(mockOPPecasBoas);
    const data = await apiFetch(withSetorId("/ordens/pecas_boas_kpi", setorId));
    return OPKPISchema.parse(data);
  },
};

export const opRefugoKPIService = {
  async getKPI(setorId = null) {
    if (USE_MOCK) return OPKPISchema.parse(mockOPRefugoKPI);
    const data = await apiFetch(withSetorId("/ordens/refugo_kpi", setorId));
    return OPKPISchema.parse(data);
  },
};

export const opEficienciaService = {
  async getEficiencia(setorId = null) {
    if (USE_MOCK) return OPEficienciaSchema.parse(mockOPEficiencia);
    const data = await apiFetch(withSetorId("/ordens/eficiencia", setorId));
    return OPEficienciaSchema.parse(data);
  },
};

export const opTopRefugoService = {
  async getTopRefugo(setorId = null) {
    if (USE_MOCK) return OPRefugoArraySchema.parse(mockOPTopRefugo);
    const data = await apiFetch(withSetorId("/ordens/top_refugo", setorId));
    return OPRefugoArraySchema.parse(data);
  },
};

export const opCargaSetorService = {
  async getCargaSetor(setorId = null) {
    if (USE_MOCK) return OPCargaSetorArraySchema.parse(mockOPCargaSetor);
    const data = await apiFetch(withSetorId("/ordens/carga_por_setor", setorId));
    return OPCargaSetorArraySchema.parse(data);
  },
};

export const opStatusService = {
  async getStatus(setorId = null) {
    if (USE_MOCK) return OPStatusArraySchema.parse(mockOPStatus);
    const data = await apiFetch(withSetorId("/ordens/status", setorId));
    return OPStatusArraySchema.parse(data);
  },
};

export const opConcluidasDiaService = {
  async getConcluidasDia(setorId = null) {
    if (USE_MOCK) return OPConcluidasDiaArraySchema.parse(mockOPConcluidasDia);
    const data = await apiFetch(withSetorId("/ordens/concluidas_por_dia", setorId));
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
 
