"use client";
import { useChartData } from "@/hooks/useChartData";
import { producaoDefeitosService } from "@services/maquinaService";
 
export function useProducaoDefeitos() {
  return useChartData(producaoDefeitosService.getProducaoDefeitos);
}