"use client";

import { useChartData } from "@/hooks/useChartData";
import { paradasPorDiaService } from "@services/paradaService";

export function useMediaParadasDia(setorId = null) {
  return useChartData(paradasPorDiaService.getParadasDia, setorId);
}
