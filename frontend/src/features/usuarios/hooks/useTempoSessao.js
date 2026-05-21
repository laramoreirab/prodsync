"use client";
import { useChartData } from "@/hooks/useChartData";
import { tempoSessaoService } from "@services/usuarioService";
export function useTempoSessao(setorId = null) {
  return useChartData(tempoSessaoService.getTempoSessao, setorId);
}