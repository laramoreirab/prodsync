"use client";
import { useChartData } from "@/hooks/useChartData";
import { opPecasBoasService } from "@services/ordenService";
export function useOPPecasBoas(setorId = null) {
  return useChartData(opPecasBoasService.getKPI, setorId);
}