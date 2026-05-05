"use client";
import { useChartData } from "@/hooks/useChartData";
import { oeeMaquinaDetalhesService } from "@services/operadorService";
import { useCallback, useState, useEffect } from "react";
import { getUserFromToken } from "@/lib/auth";

export function useOEEMaquinaDetalhes() {
  const [id_usuario, setIdUsuario] = useState(null);

  useEffect(() => {
    const user = getUserFromToken();
    if (user?.id_usuario) setIdUsuario(user.id_usuario);
  }, []);

  const fetcher = useCallback(() => {
    if (!id_usuario) return Promise.resolve(null);
    return oeeMaquinaDetalhesService.getDetalhes(id_usuario);
  }, [id_usuario]);

  return useChartData(fetcher);
}