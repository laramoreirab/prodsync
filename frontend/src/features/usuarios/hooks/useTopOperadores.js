"use client";
import { useChartData } from "@/hooks/useChartData";
import { topOperadoresService } from "@services/usuarioService";
export function useTopOperadores(setorId = null) {
  return useChartData(topOperadoresService.getTopOperadores, setorId);
}