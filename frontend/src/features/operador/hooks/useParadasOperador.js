"use client";

import { useChartData } from "@/hooks/useChartData";
import { paradasOperadorService } from "@services/operadorService";

export function useParadasOperador(operadorId) {
return useChartData(paradasOperadorService.getParadas, operadorId);
}