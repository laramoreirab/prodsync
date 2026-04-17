"use client";

import { useChartData } from "@/hooks/useChartData";
import { producaoPorTurnoLotesService} from "@services/producaoService"

export function useProducaoPorTurnoLotes() {
  return useChartData(producaoPorTurnoLotesService.getProducaoPorTurnoLotes);
}