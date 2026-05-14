"use client";
import { useChartData } from "@/hooks/useChartData";
import { opPecasBoasService } from "@services/ordenService";
export function useOPPecasBoas() {
  return useChartData(opPecasBoasService.getKPI);
}