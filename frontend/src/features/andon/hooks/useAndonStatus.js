"use client";
import { useChartData } from "@/hooks/useChartData";
import { andonStatusService } from "@services/andonService";

export function useAndonStatus() {
  return useChartData(andonStatusService.getStatus);
}