"use client";
import { useChartData } from "@/hooks/useChartData";
import { oeeSetorService } from "@services/setorService";

export function useOEEPorSetor() {
  return useChartData(oeeSetorService.getOEEPorSetor);
}