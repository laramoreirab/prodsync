"use client";
import { useChartData } from "@/hooks/useChartData";
import { opAtrasadasService } from "@services/ordenService";
export function useOPAtrasadas() {
  return useChartData(opAtrasadasService.getKPI);
}
