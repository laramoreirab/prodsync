"use client";

import { useChartData } from "@/hooks/useChartData";
import { producaoService } from "@services/producaoService";

export function usePecasPorMinuto() {
  return useChartData(producaoService.getPecasPorMinuto);
}