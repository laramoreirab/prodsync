"use client";
import { useChartData } from "@/hooks/useChartData";
import { oeeCriticoService } from "@services/setorService";

export function useOEECritico() {
  return useChartData(oeeCriticoService.getOEECritico);
}