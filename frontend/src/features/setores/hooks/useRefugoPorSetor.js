"use client";
import { useChartData } from "@/hooks/useChartData";
import { refugoSetorService } from "@services/setorService";

export function useRefugoPorSetor() {
  return useChartData(refugoSetorService.getRefugoPorSetor);
}