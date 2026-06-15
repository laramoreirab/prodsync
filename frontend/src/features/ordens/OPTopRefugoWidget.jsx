"use client";

import { BarHorizontal } from "@/components/ui/charts/components/BarHorizontal";
import { useOPTopRefugo } from "./hooks/useOPTopRefugo";
import { opTopRefugoConfig } from "./config/ordensChartConfig";

export function OPTopRefugoWidget({ setorId = null }) {
  const { data, loading, error } = useOPTopRefugo(setorId);

  if (loading) return <p className="text-sm text-muted-foreground">Sincronizando...</p>;
  if (error) return <p className="text-sm text-destructive">Erro ao carregar dados.</p>;
  if (!data) return <p className="text-xs text-muted-foreground">Nenhum dado encontrado.</p>;
  if (Array.isArray(data) && data.length === 0) return <p className="text-xs text-muted-foreground">Nenhum registro disponível.</p>;


  // Mapeia "op" para "setor" para que o BarHorizontal consiga renderizar os labels no YAxis
  const formattedData = data?.map(item => ({
    ...item,
    setor: item.op
  }));

  return (
    <div className="flex h-full flex-col p-5">
      <header className="shrink-0">
        <p className="text-sm font-semibold text-black">
          Top 3 OPs com maior Refugo
        </p>
          <p className="text-[11px] text-muted-foreground font-medium mt-0.5">Atualizado em tempo real</p>

      </header>

      <div className="mt-3 min-h-0 flex-1">
        <BarHorizontal
          data={formattedData}
          config={opTopRefugoConfig}
          yAxisWidth={118}
          heightClassName="h-full min-h-[220px]"
          paddingTopClassName="pt-2"
          barSize={36}
        />
      </div>
    </div>
  );
}
