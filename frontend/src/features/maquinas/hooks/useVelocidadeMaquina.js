"use client";
import { useCallback } from "react";
import { useChartData } from "@/hooks/useChartData";
import { velocidadeMaquinaService } from "@services/maquinaDetalheService";
 
export function useVelocidadeMaquina(maquinaId) {
  const fetcher = useCallback(
    () => velocidadeMaquinaService.getVelocidade(maquinaId),
    [maquinaId]
  );
  return useChartData(fetcher);
}