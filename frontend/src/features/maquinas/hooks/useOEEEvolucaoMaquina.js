"use client";
import { useCallback } from "react";
import { useChartData } from "@/hooks/useChartData";
import { oeeEvolucaoMaquinaService } from "@services/maquinaDetalheService";
 
export function useOEEEvolucaoMaquina(maquinaId) {
  const fetcher = useCallback(
    () => oeeEvolucaoMaquinaService.getEvolucao(maquinaId),
    [maquinaId]
  );
  return useChartData(fetcher);
}