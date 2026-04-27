"use client";
import { useCallback } from "react";
import { useChartData } from "@/hooks/useChartData";
import { metaProducaoService } from "@services/operadorService";

export function useMetaProducao(operadorId) {
  const fetcher = useCallback(
    () => metaProducaoService.getMeta(operadorId),
    [operadorId]
  );
  return useChartData(fetcher);
}