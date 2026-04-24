"use client";
import { useChartData } from "@/hooks/useChartData";
import { opStatusService } from "@services/ordenService";
export function useOPStatus() {
  return useChartData(opStatusService.getStatus);
}