"use client";
import { useChartData } from "@/hooks/useChartData";
import { opTopRefugoService } from "@services/ordenService";
export function useOPTopRefugo() {
  return useChartData(opTopRefugoService.getTopRefugo);
}