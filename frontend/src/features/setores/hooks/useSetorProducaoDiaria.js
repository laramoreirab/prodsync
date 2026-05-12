"use client";
import { useChartData } from "@/hooks/useChartData";
import { setorProducaoDiariaService } from "@services/setorService";

export function useSetorProducaoDiaria(setorId) {
  return useChartData(setorProducaoDiariaService.getProducaoDiaria, setorId);
}
