"use client";
import { useChartData } from "@/hooks/useChartData";
import { setorOEEEvolucaoService } from "@services/setorService";
 
export function useSetorOEEEvolucao(setorId) {
  return useChartData(setorOEEEvolucaoService.getEvolucao, setorId);
}
 
