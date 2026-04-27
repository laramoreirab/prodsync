"use client";
import { useChartData } from "@/hooks/useChartData";
import { setorMotivosParadaService } from "@services/setorService";
 
export function useSetorMotivosParada(setorId) {
  return useChartData(setorMotivosParadaService.getMotivos, setorId);
}
