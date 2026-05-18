"use client";
import { useChartData } from "@/hooks/useChartData";
import { turnosOperadoresService } from "@services/usuarioService";

export function useTurnosOperadores(setorId = null) {
  return useChartData(turnosOperadoresService.getTurnos, setorId);
}