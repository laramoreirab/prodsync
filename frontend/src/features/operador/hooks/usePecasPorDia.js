"use client";
import { useCallback } from "react";
import { useChartData } from "@/hooks/useChartData";
import { pecasPorDiaService } from "@services/operadorService";

export function usePecasPorDia(operadorId) {
  const fetcher = useCallback(
    () => {
      // Trava de segurança: se o ID for nulo, não chama o serviço
      if (!operadorId) return Promise.resolve(null);

      return pecasPorDiaService.getPecasPorDia(operadorId);
    },
    [operadorId]
  );

  return useChartData(fetcher);
}