"use client";
import { useCallback, useState, useEffect } from "react";
import { useChartData } from "@/hooks/useChartData";
import { oeeMaquinaService } from "@services/operadorService";

export function useOEEMaquina(operadorId) {  
if (loading) return <p>Carregando...</p>;
if (error)   return <p>Erro.</p>;
if (!data || (Array.isArray(data) && data.length === 0)) return <p>Sem dados.</p>;
  const fetcher = useCallback(
    () => {
      if (!operadorId) return Promise.resolve(null);
      return oeeMaquinaService.getOEEMaquina(operadorId);
    },
    [operadorId]
  );
  return useChartData(fetcher);
}