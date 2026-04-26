"use client";
import { useChartData } from "@/hooks/useChartData";
import { andonRankingService } from "@services/andonService";

export function useAndonRanking() {
  return useChartData(andonRankingService.getRanking);
}