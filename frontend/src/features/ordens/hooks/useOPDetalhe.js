"use client";
import { useCallback } from "react";
import { useChartData } from "@/hooks/useChartData";
import { opDetalheService } from "@services/ordenService";

export function useOPDetalhe(opId) {
  const fetcher = useCallback(
    () => opDetalheService.getDetalhe(opId),
    [opId]
  );
  return useChartData(fetcher);
}