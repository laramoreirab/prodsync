"use client";

import { LineChartBase } from "@/components/ui/charts/components/LineChart";
import { useProducaoDia } from "./hooks/useProducaoDia";
import { producaoDiaConfig } from "./config/producaoChartConfig";

export function ProducaoDiaWidget() {
  const { data, loading, error } = useProducaoDia();

  if (loading) return <p className="text-sm text-muted-foreground">Carregando...</p>;
  if (error)   return <p className="text-sm text-destructive">Erro ao carregar produção.</p>;

  return (
    <LineChartBase
      title="Produção por hora"
      data={data}
      xKey="hora"
      yKeys={["pcs"]}
      config={producaoDiaConfig}
    />
  );
}