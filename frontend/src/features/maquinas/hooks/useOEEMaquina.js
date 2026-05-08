// "use client";
// import { useCallback } from "react";
// import { useChartData } from "@/hooks/useChartData";
// import { oeeMaquinaService } from "@services/maquinaDetalheService";

// export function useOEEMaquina(maquinaId) {
//   const fetcher = useCallback(
//     () => oeeMaquinaService.getOEE(maquinaId),
//     [maquinaId]
//   );
//   return useChartData(fetcher);
// }

"use client";
import { useCallback } from "react";
import { useChartData } from "@/hooks/useChartData";
import { oeeMaquinaService } from "@services/operadorService";

export function useOEEMaquina(operadorId) {
  const fetcher = useCallback(
    () => {
      if (!operadorId) return Promise.resolve(null);
      return oeeMaquinaService.getOEEMaquina(operadorId);
    },
    [operadorId]
  );
  const result = useChartData(fetcher);
  return result;
}