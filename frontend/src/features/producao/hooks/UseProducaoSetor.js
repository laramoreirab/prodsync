// src/features/producao/hooks/useProducaoSetor.js
"use client";

import { useChartData } from "@/hooks/useChartData";
import { producaoService } from "@services/producaoService";

export function useProducaoSetor() {
  return useChartData(producaoService.getPorSetor);
}