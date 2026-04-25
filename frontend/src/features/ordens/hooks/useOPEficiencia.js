"use client";
import { useChartData } from "@/hooks/useChartData";
import { opEficienciaService } from "@services/ordenService";
export function useOPEficiencia() {
  return useChartData(opEficienciaService.getEficiencia);
}