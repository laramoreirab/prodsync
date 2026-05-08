"use client";
import { useChartData } from "@/hooks/useChartData";
import { setorProducaoMaquinaService } from "@services/setorService";

export function useSetorProducaoMaquina(setorId) {
  return useChartData(setorProducaoMaquinaService.getProducaoPorMaquina, setorId);
}