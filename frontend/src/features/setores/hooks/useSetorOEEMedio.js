"use client";
import { useChartData } from "@/hooks/useChartData";
import { setorOEEMedioService } from "@services/setorService";
 
export function useSetorOEEMedio(setorId) {
  return useChartData(setorOEEMedioService.getOEE, setorId);
}