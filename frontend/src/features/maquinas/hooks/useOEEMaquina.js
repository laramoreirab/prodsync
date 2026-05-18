"use client";
import { useCallback } from "react";
import { useChartData } from "@/hooks/useChartData";
import { oeeMaquinaService } from "@services/maquinaDetalheService";

export function useOEEMaquina(maquinaId) {
  const fetcher = useCallback(
    () => oeeMaquinaService.getOEE(maquinaId),
    [maquinaId]
  );
  return useChartData(fetcher);
}