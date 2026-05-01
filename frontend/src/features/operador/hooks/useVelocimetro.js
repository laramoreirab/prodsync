"use client";
import { useChartData } from "@/hooks/useChartData";
import { velocimetroService } from "@services/operadorService";
import { getUserFromToken } from "@/lib/auth";
import { useCallback } from "react";
export function useVelocimetro() {
const { id_usuario } = getUserFromToken() ?? {};
const fetcher = useCallback(
    () => velocimetroService.getVelocimetro(id_usuario),
    [id_usuario]
  );
  return useChartData(fetcher);
}

