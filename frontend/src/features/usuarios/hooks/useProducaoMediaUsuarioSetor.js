"use client";
import { useChartData } from "@/hooks/useChartData";
import { producaoMediaUsuarioSetorService } from "@services/usuarioService";

export function useProducaoMediaUsuarioSetor(setorId = null) {
  return useChartData(producaoMediaUsuarioSetorService.getProducaoMedia, setorId);
}