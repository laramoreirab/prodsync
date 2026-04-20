"use client";
import { useChartData } from "@/hooks/useChartData";
import { topOperadoresService } from "@services/usuarioService";
export function useTopOperadores() {
  return useChartData(topOperadoresService.getTopOperadores);
}