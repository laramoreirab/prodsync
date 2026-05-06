"use client";
import { useCallback } from "react";
import { useChartData } from "@/hooks/useChartData";
import { metaKPIService } from "@services/operadorService";

export function useMetaKPI(operadorId) {
  const fetcher = useCallback(
    () => {
      if (!operadorId) return Promise.resolve(null);
      return metaKPIService.getMetaKPI(operadorId);
    },
    [operadorId]
  );

  return useChartData(fetcher);
}