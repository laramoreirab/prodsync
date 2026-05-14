"use client";

import { BarVerticalBase } from "@/components/ui/charts/components/BarVertical";
import { useSetorMotivosParada } from "./hooks/useSetorMotivosParada";
import { setorMotivosParadaConfig } from "./config/setoresChartConfig";

export function SetorMotivosParadaWidget({ setorId }) {
  const { data, loading, error } = useSetorMotivosParada(setorId);

  return (
    <div>
      <p className="text-sm font-semibold text-black">Motivos de Parada Frequentes</p>
      <p className="text-xs text-gray-400 font-semibold mt-1">*Atualizado em tempo real</p>

      <div className="mt-2">
        <BarVerticalBase
          data={data}
          xKey="motivo"
          config={setorMotivosParadaConfig}
          loading={loading}
          error={error}
        />
      </div>
    </div>
  );
}