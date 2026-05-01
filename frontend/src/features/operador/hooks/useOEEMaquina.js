"use client";
import { useChartData } from "@/hooks/useChartData";
import { oeeMaquinaService } from "@services/operadorService";
import { getUserFromToken } from "@/lib/auth";
import { useCallback } from "react";

export function useOEEMaquina() {
  const { id_usuario } = getUserFromToken() ?? {};
  const fetcher = useCallback(
    () => oeeMaquinaService.getOEEMaquina(id_usuario),
    [id_usuario]
  );
  return useChartData(fetcher);
}