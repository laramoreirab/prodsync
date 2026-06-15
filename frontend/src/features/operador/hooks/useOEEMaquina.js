"use client";
import { useCallback, useState, useEffect } from "react";
import { useChartData } from "@/hooks/useChartData";
import { oeeMaquinaService } from "@services/operadorService";

export function useOEEMaquina(operadorId) {  
// if (loading) return <p>Sincronizando...</p>;
// if (error)  
//   return 
//    <p>Erro.</p>;
  const fetcher = useCallback(
    () => {
      if (!operadorId) return Promise.resolve(null);
      return oeeMaquinaService.getOEEMaquina(operadorId);
    },
    [operadorId]
  );
  return useChartData(fetcher);
}