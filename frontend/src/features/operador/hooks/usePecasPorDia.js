"use client";

import { useChartData } from "@/hooks/useChartData";
import { pecasPorDiaService } from "@services/operadorService";

export function usePecasPorDia(operadorId) {
return useChartData(pecasPorDiaService.getPecasPorDia, operadorId);
}