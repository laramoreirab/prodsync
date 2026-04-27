"use client";
import { useChartData } from "@/hooks/useChartData";
import { setorTopOperadoresService } from "@services/setorService";
 
export function useSetorTopOperadores(setorId) {
  return useChartData(setorTopOperadoresService.getTopOperadores, setorId);
}