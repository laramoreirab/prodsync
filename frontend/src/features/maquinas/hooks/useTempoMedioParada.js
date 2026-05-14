
"use client"
import { useChartData } from "@/hooks/useChartData";
import { tempoMedioParadaService } from "@services/maquinaService";
 
export function useTempoMedioParada() {
  return useChartData(tempoMedioParadaService.getTempoMedio);
}
 