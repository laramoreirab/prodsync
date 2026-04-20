"use client";
import { useChartData } from "@/hooks/useChartData";
import { oeeOperadorService } from "@services/operadorService";
import { useCallback } from "react";
 
export function useOEEOperador(operadorId) {
  return useChartData(oeeOperadorService.getOEE, operadorId);
}