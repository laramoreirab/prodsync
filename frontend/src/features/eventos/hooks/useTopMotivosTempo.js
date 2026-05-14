"use client";

import { useChartData } from "@/hooks/useChartData";
import { topMotivosTempoService } from "@services/eventosService";

export function useTopMotivosTempo(setorId = null) {
  return useChartData(topMotivosTempoService.getTopMotivosTempo, setorId);
}
