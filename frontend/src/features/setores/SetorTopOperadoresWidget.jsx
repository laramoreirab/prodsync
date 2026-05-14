"use client";
 
import { BarVerticalBase } from "@/components/ui/charts/components/BarVertical";
import { useSetorTopOperadores } from "./hooks/useSetorTopOperadores";
import { setorTopOperadoresConfig } from "./config/setoresChartConfig";
 
export function SetorTopOperadoresWidget({ setorId }) {
  const { data, loading, error } = useSetorTopOperadores(setorId);
 
  return (
    <div>
      <p className="text-sm font-semibold text-black">
        Top 5 operadores com maior número de peças produzidas
      </p>
      <p className="text-xs text-gray-400 font-semibold mt-1">*Atualizado em tempo real</p>
 
      <div className="mt-2">
        <BarVerticalBase
          data={data}
          xKey="operador"
          config={setorTopOperadoresConfig}
          loading={loading}
          error={error}
        />
      </div>
    </div>
  );
}