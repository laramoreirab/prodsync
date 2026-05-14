"use client";
import { useChartData } from "@/hooks/useChartData";
import { maquinaStatusService } from "@/services/maquinaService";

export function useMaquinaStatus() {
  return useChartData(maquinaStatusService.getStatus);
}