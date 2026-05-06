"use client";
import { useCallback } from "react";
import { useChartData } from "@/hooks/useChartData";
import { produtividadeDiaService } from "@services/operadorService";

export function useProdutividadeDia(operadorId) {
  const fetcher = useCallback(
    () => {
      if (!operadorId) return Promise.resolve(null);
      return produtividadeDiaService.getProdutividade(operadorId);
    },
    [operadorId]
  );

  return useChartData(fetcher);
}