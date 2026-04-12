"use client";
import { useChartData } from "@/hooks/useChartData";
import { maquinaStatusService } from "@services/maquinaStatusService";

export function useMaquinaStatus() {
  return useChartData(maquinaStatusService.getStatus);
}