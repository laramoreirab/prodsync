
"use client"
import { useChartData } from "@/hooks/useChartData";
import { tempoMedioParadaService } from "@services/maquinaService";

export function useTempoMedioParada(setorId = null) {
  return useChartData(tempoMedioParadaService.getTempoMedio, setorId);
}
 