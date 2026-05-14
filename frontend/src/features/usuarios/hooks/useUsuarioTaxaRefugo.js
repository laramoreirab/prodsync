"use client";
import { useChartData } from "@/hooks/useChartData";
import { usuarioTaxaRefugoService } from "@services/usuarioService";

export function useUsuarioTaxaRefugo(setorId = null) {
  return useChartData(usuarioTaxaRefugoService.getTaxaRefugo, setorId);
}
