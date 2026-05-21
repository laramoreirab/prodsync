"use client";
import { useChartData } from "@/hooks/useChartData";
import { opAtrasadasService } from "@services/ordenService";
export function useOPAtrasadas(setorId = null) {
  return useChartData(opAtrasadasService.getKPI, setorId);
}
