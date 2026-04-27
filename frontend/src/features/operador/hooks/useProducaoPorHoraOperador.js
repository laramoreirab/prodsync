"use client";
import { useCallback } from "react";
import { useChartData } from "@/hooks/useChartData";
import { producaoPorHoraOperadorService } from "@services/operadorService";

export function useProducaoPorHoraOperador(operadorId) {
  const fetcher = useCallback(
    () => producaoPorHoraOperadorService.getPorHora(operadorId),
    [operadorId]
  );
  return useChartData(fetcher);
}