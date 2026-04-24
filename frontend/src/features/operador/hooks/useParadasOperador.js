"use client";
import { useCallback } from "react";
import { useChartData } from "@/hooks/useChartData";
import { paradasOperadorService } from "@services/operadorService";

export function useParadasOperador(operadorId) {
  const fetcher = useCallback(
    () => paradasOperadorService.getParadas(operadorId),
    [operadorId]
  );
  return useChartData(fetcher);
}