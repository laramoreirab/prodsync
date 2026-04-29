"use client";   
import { useChartData } from "@/hooks/useChartData";
import { CumprimentoMetaSetorService } from "@services/usuarioService";
export function useCumprimentoMetaSetor() {
  return useChartData(CumprimentoMetaSetorService.getCumprimentoMetaSetor);
}