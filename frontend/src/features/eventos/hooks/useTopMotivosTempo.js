"use client";

import { useChartData } from "@/hooks/useChartData";
import { topMotivosTempoService } from "@services/eventosService";

export function useTopMotivosTempo() {
  return useChartData(topMotivosTempoService.getTopMotivosTempo);
}