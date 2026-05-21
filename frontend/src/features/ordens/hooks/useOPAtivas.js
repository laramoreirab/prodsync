"use client";
import { useChartData } from "@/hooks/useChartData";
import { opAtivasService } from "@services/ordenService";

export function useOPAtivas(setorId = null) {
  return useChartData(opAtivasService.getKPI, setorId);
}