"use client";
import { useChartData } from "@/hooks/useChartData";
import { opConcluidasDiaService } from "@services/ordenService";
export function useOPConcluidasDia() {
  return useChartData(opConcluidasDiaService.getConcluidasDia);
}