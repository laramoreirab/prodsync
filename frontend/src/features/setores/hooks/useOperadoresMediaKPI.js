"use client";
import { useChartData } from "@/hooks/useChartData";
import { operadoresMediaKPIService } from "@services/setorService";

export function useOperadoresMediaKPI() {
  return useChartData(operadoresMediaKPIService.getKPI);
}