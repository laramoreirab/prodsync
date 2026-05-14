"use client";
import { useChartData } from "@/hooks/useChartData";
import { opEficienciaService } from "@services/ordenService";
export function useOPEficiencia(setorId = null) {
  return useChartData(opEficienciaService.getEficiencia, setorId);
}
