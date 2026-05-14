"use client";
import { useChartData } from "@/hooks/useChartData";
import { opCargaSetorService } from "@services/ordenService";
export function useOPCargaSetor() {
  return useChartData(opCargaSetorService.getCargaSetor);
}