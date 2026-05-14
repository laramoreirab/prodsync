// hooks/useProducaoTotal.js
"use client";
import { useCallback } from "react";
import { useChartData } from "@/hooks/useChartData";
import { producaoTotalService } from "@services/maquinaService";

export function useProducaoTotal(periodo, setorId = null) {
  const fetcher = useCallback(
    () => producaoTotalService.getProducaoTotal(periodo, setorId),
    [periodo, setorId]
  );
  return useChartData(fetcher);
}