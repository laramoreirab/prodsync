// src/features/producao/hooks/useProducaoDia.js
"use client";

import { useChartData } from "@/hooks/useChartData";
import { refugoService } from "@services/refugoService";

export function useTendenciaRefugo() {
  return useChartData(refugoService.getTendenciaRefugo);
}