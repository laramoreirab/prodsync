"use client";

import { useChartData } from "@/hooks/useChartData";
import { eventosService } from "@services/eventosService";

export function useParadasComparadas() {
  return useChartData(eventosService.getParadasComparadas);
}