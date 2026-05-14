"use client";

import { AreaChartBase } from "@/components/ui/charts/components/AreaChart";
import { useTendenciaRefugo } from "./hooks/useTendenciaRefugo";
import { tendenciaRefugoConfig } from "./config/refugoChartConfig";

export function TendendiaRefugoWidget() {
  const { data, loading, error } = useTendenciaRefugo();

    if (loading) return <p className="text-xs text-muted-foreground">Carregando...</p>;
  if (error)   return <p className="text-xs text-red-500">Erro ao carregar dados.</p>;
  if (!data)   return <p className="text-xs text-muted-foreground">Nenhum dado encontrado.</p>;
  if (Array.isArray(data) && data.length === 0) return <p className="text-xs text-muted-foreground">Nenhum registro disponível.</p>;
  
  return (
    <AreaChartBase
      title="Tendência de Refugo"
      description="Quantidade de refugo por dia"
      data={data}
      xKey="dia"
      yKey="qtd"
      config={tendenciaRefugoConfig}
    />
  );
}