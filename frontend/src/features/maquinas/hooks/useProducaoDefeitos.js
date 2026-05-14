"use client";
import { useChartData } from "@/hooks/useChartData";
import { producaoDefeitosService } from "@services/maquinaService";

export function useProducaoDefeitos(setorId = null) {
  return useChartData(producaoDefeitosService.getProducaoDefeitos, setorId);
}