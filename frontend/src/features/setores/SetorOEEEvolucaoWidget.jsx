"use client";

import { AreaChartBase } from "@/components/ui/charts/components/AreaChart"; // Certifique-se de que o caminho está correto
import { useSetorOEEEvolucao } from "./hooks/useSetorOEEEvolucao";
import { setorOEEEvolucaoConfig } from "./config/setoresChartConfig";

export function SetorOEEEvolucaoWidget({ setorId }) {
  const { data, loading, error } = useSetorOEEEvolucao(setorId);

  if (loading) return <div className="h-[200px] flex items-center justify-center">Carregando...</div>;
  if (error) return <div className="h-[200px] flex items-center justify-center text-destructive">Erro ao carregar dados.</div>;

  return (
    <div>
      <p className="text-sm font-semibold text-black">Evolução do OEE</p>
      <p className="text-xs text-gray-400 font-semibold mt-1">
        *Atualizado em tempo real
      </p>

      <div className="mt-2">
        <AreaChartBase
          data={data}
          xKey="dia"
          yKey="oee" 
          config={setorOEEEvolucaoConfig}
        />
      </div>
    </div>
  );
}