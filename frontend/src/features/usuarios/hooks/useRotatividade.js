"use client"
import { useChartData } from "@/hooks/useChartData";
import { rotatividadeService } from "@services/usuarioService";
export function useRotatividade() {
  return useChartData(rotatividadeService.getRotatividade);
}