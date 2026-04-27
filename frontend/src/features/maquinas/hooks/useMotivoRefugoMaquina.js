"use client";
import { useCallback } from "react";
import { useChartData } from "@/hooks/useChartData";
import { motivoRefugoMaquinaService } from "@services/maquinaDetalheService";
 
export function useMotivoRefugoMaquina(maquinaId) {
  const fetcher = useCallback(
    () => motivoRefugoMaquinaService.getMotivos(maquinaId),
    [maquinaId]
  );
  return useChartData(fetcher);
}