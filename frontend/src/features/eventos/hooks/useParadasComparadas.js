"use client";

import { useChartData } from "@/hooks/useChartData";
import { eventosService } from "@services/eventosService";

export function useParadasComparadas(setorId = null) {
  return useChartData(eventosService.getParadasComparadas, setorId);
}