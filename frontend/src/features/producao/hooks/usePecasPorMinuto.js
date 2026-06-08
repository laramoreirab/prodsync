"use client";

import { useChartData } from "@/hooks/useChartData";
import { pecasPorMinutosService } from "@services/producaoService";

export function usePecasPorMinuto(setorId = null) {
  return useChartData(pecasPorMinutosService.getPecasPorMinuto, setorId);
}
