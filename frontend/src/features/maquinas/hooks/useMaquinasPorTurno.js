"use client";
import { useChartData } from "@/hooks/useChartData";
import { maquinasPorTurnoService } from "@services/maquinaService";
 
export function useMaquinasPorTurno() {
  return useChartData(maquinasPorTurnoService.getMaquinasPorTurno);
}