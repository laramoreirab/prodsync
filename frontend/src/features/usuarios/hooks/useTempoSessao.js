"use client";
import { useChartData } from "@/hooks/useChartData";
import { tempoSessaoService } from "@services/usuarioService";
export function useTempoSessao() {
  return useChartData(tempoSessaoService.getTempoSessao);
}