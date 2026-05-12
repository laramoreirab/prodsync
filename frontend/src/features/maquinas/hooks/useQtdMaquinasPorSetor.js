"use client";
import { useChartData } from "@/hooks/useChartData";
import { qtdMaquinasPorSetorService } from "@services/maquinaService";

export function useQtdMaquinasPorSetor(setorId = null) {
  return useChartData(qtdMaquinasPorSetorService.getQtdPorSetor, setorId);
}
 