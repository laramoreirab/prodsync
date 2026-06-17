"use client";

import { AreaChartBase } from "@/components/ui/charts/components/AreaChart";
import { useOPConcluidasDia } from "./hooks/useOPConcluidasDia";
import { opConcluidasConfig } from "./config/ordensChartConfig";

export function OPConcluidasDiaWidget({ setorId = null }) {
  const { data, loading, error } = useOPConcluidasDia(setorId);
  
  if (loading) return <p className="text-sm text-muted-foreground">Sincronizando...</p>;
  if (error)   return <p className="text-sm text-destructive">Erro ao carregar dados.</p>;
   if (!data) return <p className="text-xs text-muted-foreground">Nenhum dado encontrado.</p>;
  if (Array.isArray(data) && data.length === 0) return <p className="text-xs text-muted-foreground">Nenhum registro disponível.</p>;


  return (
<div className="flex h-full w-full flex-col">
      <div className="shrink-0">
        <p className="text-sm font-semibold text-black">
          OPs Concluídas
        </p>
          <p className="text-[11px] text-muted-foreground font-medium mt-0.5">Atualizado em tempo real</p>

      </div>

      <div className="min-h-0 flex-1 flex flex-col justify-center items-center w-full">
        <div className="w-full flex justify-center flex-col">
        <AreaChartBase
          data={data}
          xKey="dia"
          yKey="total"
          config={opConcluidasConfig}
          size="AA"
        />
      </div>
      </div>
    </div>
  );
}