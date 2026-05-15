"use client";
import { useChartData } from "@/hooks/useChartData";
import { qtdMaquinasPorSetorService } from "@services/maquinaService";
 
export function useQtdMaquinasPorSetor() {
  return useChartData(qtdMaquinasPorSetorService.getQtdPorSetor);
}
 