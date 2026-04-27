"use client";
import { useCallback } from "react";
import { useChartData } from "@/hooks/useChartData";
import { opProgressoService } from "@services/ordenService";

export function useOPProgresso(opId) {
  const fetcher = useCallback(
    () => opProgressoService.getProgresso(opId),
    [opId]
  );
  return useChartData(fetcher);
}