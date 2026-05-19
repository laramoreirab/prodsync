"use client"
import { useChartData } from "@/hooks/useChartData";
import { rotatividadeService } from "@services/usuarioService";
export function useRotatividade(setorId = null) {
  return useChartData(rotatividadeService.getRotatividade, setorId);
}