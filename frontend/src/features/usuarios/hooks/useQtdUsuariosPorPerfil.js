"use client";
import { useChartData } from "@/hooks/useChartData";
import { qtdUsuariosPerfilService } from "@services/usuarioService";
export function useQtdUsuariosPorPerfil() {
  return useChartData(qtdUsuariosPerfilService.getQtdPorPerfil);
}