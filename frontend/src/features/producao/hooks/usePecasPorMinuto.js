"use client";

import { useChartData } from "@/hooks/useChartData";
import { pecasPorMinutosService } from "@services/producaoService";

export function usePecasPorMinuto() {
  return useChartData(pecasPorMinutosService.getPecasPorMinuto);
}