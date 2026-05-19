"use client";
import { useChartData } from "@/hooks/useChartData";
import { maquinasPorTurnoService } from "@services/maquinaService";
 
export function useMaquinasPorTurno(setorId = null) {
  return useChartData(maquinasPorTurnoService.getMaquinasPorTurno, setorId);
}