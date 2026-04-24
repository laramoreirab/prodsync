"use client";
import { useCallback } from "react";
import { useChartData } from "@/hooks/useChartData";
import { oeeOperadorService } from "@services/operadorService";

export function useOEEOperador(operadorId) {
  const fetcher = useCallback(
    () => oeeOperadorService.getOEE(operadorId),
    [operadorId]
  );
  return useChartData(fetcher);
}