"use client";
import { useChartData } from "@/hooks/useChartData";
import { qtdUsuariosSetorService } from "@services/usuarioService";
export function useQtdUsuariosPorSetor() {
  return useChartData(qtdUsuariosSetorService.getQtdPorSetor);
}