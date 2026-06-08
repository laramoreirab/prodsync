"use client";
import { useChartData } from "@/hooks/useChartData";
import { qtdUsuariosPerfilService } from "@services/usuarioService";
export function useQtdUsuariosPorPerfil(setorId = null) {
  return useChartData(qtdUsuariosPerfilService.getQtdPorPerfil, setorId);
}
