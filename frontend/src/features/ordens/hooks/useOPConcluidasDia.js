"use client";
import { useChartData } from "@/hooks/useChartData";
import { opConcluidasDiaService } from "@services/ordenService";
export function useOPConcluidasDia(setorId = null) {
  return useChartData(opConcluidasDiaService.getConcluidasDia, setorId);
}