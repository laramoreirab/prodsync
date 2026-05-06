"use client";
import { useCallback } from "react";
import { useChartData } from "@/hooks/useChartData";
import { metaProducaoService } from "@services/operadorService";

export function useMetaProducao(operadorId) {
  const fetcher = useCallback(
    () => {
      // Trava de segurança: Se não houver ID, não tenta buscar a meta.
      if (!operadorId) return Promise.resolve(null);

      return metaProducaoService.getMeta(operadorId);
    },
    [operadorId]
  );

  return useChartData(fetcher);
}