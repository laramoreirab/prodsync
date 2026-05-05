"use client";
import { useChartData } from "@/hooks/useChartData";
import { produtividadeDiaService } from "@services/operadorService";
import { getUserFromToken } from "@/lib/auth";
import { useCallback } from "react";

export function useProdutividadeDia() {
const { id_usuario } = getUserFromToken() ?? {};
const fetcher = useCallback(
    () => produtividadeDiaService.getProdutividade(id_usuario),
    [id_usuario]
  );
  return useChartData(fetcher);
}
