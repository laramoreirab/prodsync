"use client";
import { useCallback } from "react";
import { useChartData } from "@/hooks/useChartData";
import { motivoSetupMaquinaService } from "@services/maquinaDetalheService";

export function useMotivoSetupMaquina(maquinaId) {
  const fetcher = useCallback(
    () => motivoSetupMaquinaService.getMotivos(maquinaId),
    [maquinaId]
  );
  return useChartData(fetcher);
}