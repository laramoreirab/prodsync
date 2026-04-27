"use client";
import { useCallback } from "react";
import { useChartData } from "@/hooks/useChartData";
import { opOEEDetalheService } from "@services/ordenService";

export function useOPOEEDetalhe(opId) {
  const fetcher = useCallback(
    () => opOEEDetalheService.getOEE(opId),
    [opId]
  );
  return useChartData(fetcher);
}