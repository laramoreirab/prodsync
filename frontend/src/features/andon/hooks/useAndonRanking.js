"use client";

import { useCallback } from "react";
import { useChartData } from "@/hooks/useChartData";
import { andonRankingService } from "@services/andonService";

export function useAndonRanking(scope = "factory") {
  const fetchRanking = useCallback(() => andonRankingService.getRanking(scope), [scope]);

  return useChartData(fetchRanking);
}
