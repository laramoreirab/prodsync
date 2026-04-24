"use client";   
import { useChartData } from "@/hooks/useChartData";
import { sobrecargaSetorService } from "@services/usuarioService";
export function useSobrecargaSetor() {
  return useChartData(sobrecargaSetorService.getSobrecarga);
}