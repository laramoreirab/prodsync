"use client";
import { useChartData } from "@/hooks/useChartData";
import { setorTotalKPIService } from "@services/setorService";

export function useSetorTotalKPI() {
  return useChartData(setorTotalKPIService.getKPI);
}