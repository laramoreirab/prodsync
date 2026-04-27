"use client";
import { useChartData } from "@/hooks/useChartData";
import { setorProducaoSemanalService } from "@services/setorService";
 
export function useSetorProducaoSemanal(setorId) {
  return useChartData(setorProducaoSemanalService.getProducaoSemanal, setorId);
}
 
