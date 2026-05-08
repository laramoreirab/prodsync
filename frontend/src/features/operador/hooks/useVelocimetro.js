"use client";
import { useCallback } from "react";
import { useChartData } from "@/hooks/useChartData";
import { velocimetroService } from "@services/operadorService";

export function useVelocimetro(operadorId) {
  const fetcher = useCallback(
    () => {
      if (!operadorId) return Promise.resolve(null);
      return velocimetroService.getVelocimetro(operadorId);
    },
    [operadorId]
  );

  return useChartData(fetcher);
}