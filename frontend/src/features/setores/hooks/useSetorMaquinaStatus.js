"use client";
import { useChartData } from "@/hooks/useChartData";
import { setorMaquinaStatusService } from "@services/setorService";
 
export function useSetorMaquinaStatus(setorId) {
  return useChartData(setorMaquinaStatusService.getStatus, setorId);
}