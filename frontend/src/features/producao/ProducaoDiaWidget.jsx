"use client";

import { AreaChartBase } from "@/components/ui/charts/components/AreaChart";
import { useProducaoDia } from "./hooks/useProducaoDia";
import { producaoDiaConfig } from "./config/producaoChartConfig";

export function ProducaoDiaWidget() {
  const { data, loading, error } = useProducaoDia();

    if (loading) return <p className="text-xs text-muted-foreground">Carregando...</p>;
  if (error)   return <p className="text-xs text-red-500">Erro ao carregar dados.</p>;
  if (!data)   return <p className="text-xs text-muted-foreground">Nenhum dado encontrado.</p>;
  if (Array.isArray(data) && data.length === 0) return <p className="text-xs text-muted-foreground">Nenhum registro disponível.</p>;
  
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