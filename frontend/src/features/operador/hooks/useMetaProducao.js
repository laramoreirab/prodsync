"use client";

import { useChartData } from "@/hooks/useChartData";
import { metaProducaoService } from "@services/operadorService";

export function useMetaProducao(operadorId) {
return useChartData(metaProducaoService.getMeta, operadorId);
}