// src/features/producao/hooks/useProducaoDia.js
"use client";

import { useChartData } from "@/hooks/useChartData";
import { producaoService } from "@services/producaoService";

export function useProducaoDia() {
  return useChartData(producaoService.getPorHora);
}