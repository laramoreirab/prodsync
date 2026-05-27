"use client";
import { useCallback } from "react";
import { useChartData } from "@/hooks/useChartData";
import { oeeOperadorService } from "@services/operadorService";

export function useOEEOperador(operadorId) {
  const fetcher = useCallback(
    () => {
      if (!operadorId) return Promise.resolve(null);
      return oeeOperadorService.getOEE(operadorId);
    },
    [operadorId]
  );
  return useChartData(fetcher);
}