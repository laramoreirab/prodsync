"use client";

import { useChartData } from "@/hooks/useChartData";
import { paradasPorDiaService } from "@services/paradaService";

export function useMediaParadasDia() {
  return useChartData(paradasPorDiaService.getParadasDia);
}