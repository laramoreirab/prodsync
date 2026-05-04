"use client";
import { useCallback, useState, useEffect } from "react";
import { useChartData } from "@/hooks/useChartData";
import { oeeMaquinaService } from "@services/operadorService";

export function useOEEMaquina() {
  const [idUsuario, setIdUsuario] = useState(null);

  useEffect(() => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const payload = JSON.parse(atob(token.split(".")[1]));
      if (payload?.id_usuario) setIdUsuario(payload.id_usuario);
    } catch {
    }
  }, []);

  const fetcher = useCallback(
    () => {
      if (!idUsuario) return Promise.resolve(null);
      return oeeMaquinaService.getOEEMaquina(idUsuario);
    },
    [idUsuario]
  );

  return useChartData(fetcher);
}