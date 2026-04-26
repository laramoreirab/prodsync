"use client";
 
import { LineChartBase } from "@/components/ui/charts/components/LineChart";
import { useSetorOEEEvolucao } from "./hooks/useSetorOEEEvolucao";
import { setorOEEEvolucaoConfig } from "./config/setoresChartConfig";
 
export function SetorOEEEvolucaoWidget({ setorId }) {
  const { data, loading, error } = useSetorOEEEvolucao(setorId);
 
  return (
    <div>
      <p className="text-sm font-semibold text-black">Evolução do OEE</p>
      <p className="text-xs text-gray-400 font-semibold mt-1">*Atualizado em tempo real</p>
 
      <div className="mt-2">
        <LineChartBase
          data={data}
          xKey="dia"
          yKeys={["oee"]}
          config={setorOEEEvolucaoConfig}
          loading={loading}
          error={error}
        />
      </div>
    </div>
  );
}
 
