"use client";

import { useChartData } from "@/hooks/useChartData";
import { producaoPorHoraOperadorService } from "@services/operadorService";

export function useProducaoPorHoraOperador(operadorId) {
return useChartData(producaoPorHoraOperadorService.getPorHora, operadorId);
}