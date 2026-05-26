"use client";
import { useCallback } from "react";
import { useChartData } from "@/hooks/useChartData";
import { opProgressoService } from "@services/ordenService";

export function useOPProgresso(opId) {
  const fetcher = useCallback(
    () => {
      if (!opId) return Promise.resolve(null);
      return opProgressoService.getProgresso(opId);
    },
    [opId]
  );
  return useChartData(fetcher);
}