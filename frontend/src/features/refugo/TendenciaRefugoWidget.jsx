"use client";

import { LineChartBase } from "@/components/ui/charts/components/LineChart";
import { useTendenciaRefugo } from "./hooks/useTendenciaRefugo";
import { tendenciaRefugoConfig } from "./config/refugoChartConfig";

export function TendendiaRefugoWidget() {
  const { data, loading, error } = useTendenciaRefugo();

  if (loading) return <p className="text-sm text-muted-foreground">Carregando...</p>;
  if (error)   return <p className="text-sm text-destructive">Erro ao carregar produção.</p>;

  return (
    <LineChartBase
      title="Tendencia de Refugo"
      data={data}
      xKey="dia"
      yKeys={["qtd"]}
      config={tendenciaRefugoConfig}
    />
  );
}