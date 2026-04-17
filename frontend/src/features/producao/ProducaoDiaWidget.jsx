"use client";

import { AreaChartBase } from "@/components/ui/charts/components/AreaChart";
import { useProducaoDia } from "./hooks/useProducaoDia";
import { producaoDiaConfig } from "./config/producaoChartConfig";

export function ProducaoDiaWidget() {
  const { data, loading, error } = useProducaoDia();

  if (loading) return <p className="text-sm text-muted-foreground">Carregando...</p>;
  if (error)   return <p className="text-sm text-destructive">Erro ao carregar produção.</p>;

  return (
    <AreaChartBase
      title="Produção por hora"
      description="Peças produzidas ao longo do dia"
      data={data}
      xKey="hora"
      yKey="pcs"
      config={producaoDiaConfig}
    />
  );
}