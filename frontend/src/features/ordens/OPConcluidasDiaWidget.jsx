"use client";

import { AreaChartBase } from "@/components/ui/charts/components/AreaChart";
import { useOPConcluidasDia } from "./hooks/useOPConcluidasDia";
import { opConcluidasConfig } from "./config/ordensChartConfig";

export function OPConcluidasDiaWidget({ setorId = null }) {
  const { data, loading, error } = useOPConcluidasDia(setorId);

    if (loading) return <p className="text-xs text-muted-foreground">Carregando...</p>;
  if (error)   return <p className="text-xs text-red-500">Erro ao carregar dados.</p>;
  if (!data)   return <p className="text-xs text-muted-foreground">Nenhum dado encontrado.</p>;
  if (Array.isArray(data) && data.length === 0) return <p className="text-xs text-muted-foreground">Nenhum registro disponível.</p>;
  
  return (
    <div className="p-5 h-full">
      <header>
        <p className="text-sm font-semibold text-black">
          OPs Concluídas
        </p>
        <p className="text-xs text-gray-400 font-semibold mt-1">
          *Atualizado em tempo real
        </p>
      </header>

      <div className="mt-2">
        <AreaChartBase
          data={data}
          xKey="dia"
          yKey="total"
          config={opConcluidasConfig}
        />
      </div>
    </div>
  );
}
