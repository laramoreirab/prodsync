"use client";
import { useChartData } from "@/hooks/useChartData";
import { opAtivasService } from "@services/ordenService";

export function useOPAtivas() {
  return useChartData(opAtivasService.getKPI);
}