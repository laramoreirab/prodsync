"use client";
import { useCallback } from "react";
import { useChartData } from "@/hooks/useChartData";
import { qualidadeService } from "@services/operadorService";

export function useQualidade(operadorId) {
  const fetcher = useCallback(
    () => {
      if (!operadorId) return Promise.resolve(null);
      return qualidadeService.getQualidade(operadorId);
    },
    [operadorId]
  );

  return useChartData(fetcher);
}