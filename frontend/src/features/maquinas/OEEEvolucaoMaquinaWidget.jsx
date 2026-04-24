"use client";
import { AreaChartBase } from "@/components/ui/charts/components/AreaChart";
import { useOEEEvolucaoMaquina } from "./hooks/useOEEEvolucaoMaquina";
import { oeeEvolucaoConfig } from "./config/maquinaDetalheConfig";
 
export function OEEEvolucaoMaquinaWidget({ maquinaId }) {
  const { data, loading, error } = useOEEEvolucaoMaquina(maquinaId);
 
  if (loading) return <p className="text-sm text-muted-foreground">Carregando...</p>;
  if (error)   return <p className="text-sm text-destructive">Erro ao carregar evolução.</p>;
 
  return (
    <div>
      <p className="text-sm font-semibold text-black">Evolução do OEE há 7 dias</p>
      <p className="text-xs text-gray-400 font-semibold mt-1">*Atualizado em tempo real</p>
      <div className="mt-2">
        <AreaChartBase
          data={data}
          xKey="dia"
          yKey="oee"
          config={oeeEvolucaoConfig}
        />
      </div>
    </div>
  );
}
 