"use client";
import { useChartData } from "@/hooks/useChartData";
import { opTopRefugoService } from "@services/ordenService";
export function useOPTopRefugo(setorId = null) {
  return useChartData(opTopRefugoService.getTopRefugo, setorId);
}