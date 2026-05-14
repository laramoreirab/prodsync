"use client";
import { useChartData } from "@/hooks/useChartData";
import { opRefugoKPIService } from "@services/ordenService";
export function useOPRefugoKPI() {
  return useChartData(opRefugoKPIService.getKPI);
}
