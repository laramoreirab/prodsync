"use client";
import { useCallback } from "react";
import { useChartData } from "@/hooks/useChartData";
import { eficienciaMaquinaService } from "@services/operadorService";

export function useEficienciaMaquina(operadorId) {
  const fetcher = useCallback(
    () => {
      // Trava de segurança: se não tiver o ID do operador, não faz a chamada
      if (!operadorId) return Promise.resolve(null);
      
      return eficienciaMaquinaService.getEficiencia(operadorId);
    },
    [operadorId]
  );

  return useChartData(fetcher);
}