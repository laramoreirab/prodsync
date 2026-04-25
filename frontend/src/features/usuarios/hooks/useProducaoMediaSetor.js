"use client";
import { useChartData } from "@/hooks/useChartData";
import { producaoMediaSetorService } from "@services/usuarioService";
export function useProducaoMediaSetor() {
  return useChartData(producaoMediaSetorService.getProducaoMedia);
}
