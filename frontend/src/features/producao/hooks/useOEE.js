
// src/features/producao/hooks/useOEE.js
"use client";

import { useChartData } from "@/hooks/useChartData";
import { producaoService } from "@services/producaoService";

export function useOEE() {
  return useChartData(producaoService.getOEE);
}