"use client";
import { DonutChart } from "@/components/ui/charts/components/DonutChart";
import { useMaquinaStatus } from "./hooks/useMaquinaStatus";
import { maquinaStatusConfig } from "./config/maquinaChartConfig";

export function MaquinaStatusDonutWidget() {
  const { data, loading, error } = useMaquinaStatus();

  if (loading) return <p className="text-sm text-muted-foreground">Carregando...</p>;
  if (error)   return <p className="text-sm text-destructive">Erro ao carregar status.</p>;

  return (
    
    <DonutChart
      data={data}
      config={maquinaStatusConfig}
      dataKey="value"
      nameKey="name"
    />
  );
}