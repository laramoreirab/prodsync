"use client";
import { useChartData } from "@/hooks/useChartData";
import { maquinaStatusService } from "@/services/maquinaService";

export function useMaquinaStatus(setorId = null) {
  return useChartData(maquinaStatusService.getStatus, setorId);
}