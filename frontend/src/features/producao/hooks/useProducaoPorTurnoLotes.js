"use client";

import { useChartData } from "@/hooks/useChartData";
import { producaoPorTurnoLotesService} from "@services/producaoService"

export function useProducaoPorTurnoLotes(setorId = null) {
  return useChartData(producaoPorTurnoLotesService.getProducaoPorTurnoLotes, setorId);
}
