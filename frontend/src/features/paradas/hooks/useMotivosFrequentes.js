// src/features/producao/hooks/useMotivosFrequentes.js
"use client";

import { useChartData } from "@/hooks/useChartData";
import { paradaService } from "@services/paradaService";

export function useMotivosFrequentes() {
  return useChartData(paradaService.getParadas);
}