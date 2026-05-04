"use client";
import { useChartData } from "@/hooks/useChartData";
import { metaKPIService } from "@services/operadorService";
import { getUserFromToken } from "@/lib/auth";
import { useCallback } from "react";

export function useMetaKPI() {
  const { id_usuario } = getUserFromToken() ?? {};
  const fetcher = useCallback(
    () => metaKPIService.getMetaKPI(id_usuario),
    [id_usuario]
  );
  return useChartData(fetcher);
}