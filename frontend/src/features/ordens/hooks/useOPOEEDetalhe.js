"use client";
import { useCallback } from "react";
import { useChartData } from "@/hooks/useChartData";
import { opOEEDetalheService } from "@services/ordenService";

export function useOPOEEDetalhe(opId, maquinaId) {
  const fetcher = useCallback(
    () => {
      if (!opId) return Promise.resolve(null);
      return opOEEDetalheService.getOEE(opId, maquinaId);
    },
    [opId, maquinaId]
  );
  return useChartData(fetcher);
}