"use client";
import { useCallback } from "react";
import { useChartData } from "@/hooks/useChartData";
import { producaoPorHoraOperadorService } from "@services/operadorService";

export function useProducaoPorHoraOperador(operadorId) {
  const fetcher = useCallback(
    () => {
      // Trava de segurança: impede a busca se o ID do operador for nulo ou indefinido
      if (!operadorId) return Promise.resolve(null);

      return producaoPorHoraOperadorService.getPorHora(operadorId);
    },
    [operadorId]
  );

  return useChartData(fetcher);
}