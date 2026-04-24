"use client";
import { useCallback } from "react";
import { useChartData } from "@/hooks/useChartData";
import { eficienciaMaquinaService } from "@services/operadorService";

export function useEficienciaMaquina(operadorId) {
  const fetcher = useCallback(
    () => eficienciaMaquinaService.getEficiencia(operadorId),
    [operadorId]
  );
  return useChartData(fetcher);
}