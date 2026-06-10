"use client";

import { useChartData } from "@/hooks/useChartData";
import { maquinaAtivaPorTurnoService } from "@services/maquinaService";

export function useMaquinaAtivaPorTurno(setorId = null) {
  return useChartData(maquinaAtivaPorTurnoService.getMaquinaAtivaPorTurnoService, setorId);
}
