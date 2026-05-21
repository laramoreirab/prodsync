"use client";
import { useChartData } from "@/hooks/useChartData";
import { opStatusService } from "@services/ordenService";
export function useOPStatus(setorId = null) {
  return useChartData(opStatusService.getStatus, setorId);
}