"use client";

import { AreaChartBase } from "@/components/ui/charts/components/AreaChart";
import { useOEEEvolucaoMaquina } from "./hooks/useOEEEvolucaoMaquina";
import { oeeEvolucaoConfig } from "./config/maquinaDetalheConfig";

export function OEEEvolucaoMaquinaWidget({ maquinaId }) {
  const { data, loading, error } = useOEEEvolucaoMaquina(maquinaId);

  if (loading) return <p className="text-sm text-muted-foreground p-4">Carregando evolução...</p>;
  if (error) return <p className="text-sm text-destructive p-4">Erro ao carregar evolução.</p>;
  if (!data) return <p className="text-xs text-muted-foreground p-4">Nenhum dado encontrado.</p>;
  if (Array.isArray(data) && data.length === 0) return <p className="text-xs text-muted-foreground p-4">Nenhum registro disponível.</p>;

  return (
    <div className="flex flex-col gap-1 w-full p-4 h-full justify-between">
      <div className="text-left w-full">
        <h2 className="text-sm font-semibold tracking-tight text-foreground">
          Evolução do OEE nos últimos 7 dias
        </h2>
          <p className="text-[11px] text-muted-foreground font-medium mt-0.5">Atualizado em tempo real</p>
      </div>

      <div className="mt-4 w-full h-full min-h-[160px]">
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