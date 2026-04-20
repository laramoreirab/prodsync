"use client";

import { useChartData } from "@/hooks/useChartData";
import { eficienciaMaquinaService } from "@services/operadorService";

export function useEficienciaMaquina(operadorId) {
return useChartData(eficienciaMaquinaService.getEficiencia, operadorId);
}