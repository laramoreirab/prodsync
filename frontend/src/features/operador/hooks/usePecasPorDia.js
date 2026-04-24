"use client";
import { useCallback } from "react";
import { useChartData } from "@/hooks/useChartData";
import { pecasPorDiaService } from "@services/operadorService";

export function usePecasPorDia(operadorId) {
  const fetcher = useCallback(
    () => pecasPorDiaService.getPecasPorDia(operadorId),
    [operadorId]
  );
  return useChartData(fetcher);
}