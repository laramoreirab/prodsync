// src/features/producao/hooks/useProducaoDia.js
"use client";

import { useChartData } from "@/hooks/useChartData";
import { refugoService } from "@services/refugoService";

export function useTendenciaRefugo(setorId = null) {
  return useChartData(refugoService.getTendenciaRefugo, setorId);
}
