"use client";
import { useChartData } from "@/hooks/useChartData";
import { oeeOperadorService } from "@services/operadorService";
 
export function useOEEOperador(operadorId) {
  return useChartData(oeeOperadorService.getOEE, operadorId);
}