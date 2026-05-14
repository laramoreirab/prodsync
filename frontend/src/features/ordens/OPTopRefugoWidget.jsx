"use client";

import { BarHorizontal } from "@/components/ui/charts/components/BarHorizontal";
import { useOPTopRefugo } from "./hooks/useOPTopRefugo";
import { opTopRefugoConfig } from "./config/ordensChartConfig";

export function OPTopRefugoWidget() {
  const { data, loading, error } = useOPTopRefugo();

  if (loading) return <p className="text-sm text-muted-foreground">Carregando...</p>;
  if (error)   return <p className="text-sm text-destructive">Erro ao carregar dados.</p>;

  // Mapeia "op" para "setor" para que o BarHorizontal consiga renderizar os labels no YAxis
  const formattedData = data?.map(item => ({
    ...item,
    setor: item.op 
  }));

  return (
    <div className="p-5 h-full">
      <header>
        <p className="text-sm font-semibold text-black">
          Top 3 OPs com maior Refugo
        </p>
        <p className="text-xs text-gray-400 font-semibold mt-1">
          *Atualizado em tempo real
        </p>
      </header>

      <div className="mt-2">
        <BarHorizontal
          data={formattedData}
          config={opTopRefugoConfig}
        />
      </div>
    </div>
  );
}