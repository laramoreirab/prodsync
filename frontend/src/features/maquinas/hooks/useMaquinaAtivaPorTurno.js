"use client";

import { useChartData } from "@/hooks/useChartData";
import { maquinaAtivaPorTurnoService } from "@/services/maquinaService";

export function useMaquinaAtivaPorTurno() {
  return useChartData(maquinaAtivaPorTurnoService.getMaquinaAtivaPorTurnoService);
}