"use client";
import { useChartData } from "@/hooks/useChartData";
import { opRefugoKPIService } from "@services/ordenService";
export function useOPRefugoKPI(setorId = null) {
  return useChartData(opRefugoKPIService.getKPI, setorId);
}