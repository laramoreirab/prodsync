"use client";
import { useCallback } from "react";
import { useChartData } from "@/hooks/useChartData";
import { TempoParadoTempoProduzindoOperadorService } from "@services/operadorService";

export function useTempoParadoTempoProduzindoOperador(operadorId) {
  const fetcher = useCallback(
    () => TempoParadoTempoProduzindoOperadorService.getTempoParadoTempoProduzindoOperador(operadorId),
    [operadorId]
  );
  return useChartData(fetcher);
}