"use client";

import { AreaChartBase } from "@/components/ui/charts/components/AreaChart";
import { useTendenciaRefugo } from "./hooks/useTendenciaRefugo";
import { tendenciaRefugoConfig } from "./config/refugoChartConfig";

export function TendendiaRefugoWidget() {
  const { data, loading, error } = useTendenciaRefugo();

  if (loading) return <p className="text-sm text-muted-foreground">Carregando...</p>;
  if (error)   return <p className="text-sm text-destructive">Erro ao carregar refugo.</p>;

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