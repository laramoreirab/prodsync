"use client";
import { useChartData } from "@/hooks/useChartData";
import { setorService } from "@services/setorService";

export function useSetores() {
  return useChartData(setorService.getSetores);
}