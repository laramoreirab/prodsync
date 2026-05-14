"use client";

import { useCallback } from "react";
import { useChartData } from "@/hooks/useChartData";
import { andonRankingService } from "@services/andonService";

export function useAndonRanking(scope = "factory", idSetor = null) {
  const fetchRanking = useCallback(
    () => andonRankingService.getRanking(scope, idSetor),
    [scope, idSetor]
  );

  return useChartData(fetchRanking);
}
