"use client";
import { useChartData } from "@/hooks/useChartData";
import { qualidadeService } from "@services/operadorService";
import { getUserFromToken } from "@/lib/auth";
import { useCallback } from "react";
export function useQualidade() {
    const { id_usuario } = getUserFromToken() ?? {};
const fetcher = useCallback(
    () => qualidadeService.getQualidade(id_usuario),
    [id_usuario]
  );
  return useChartData(fetcher);
}

