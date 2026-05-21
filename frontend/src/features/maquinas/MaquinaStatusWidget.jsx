"use client";
import { CustomPieChart } from "@/components/ui/charts/components/PieChart";
import { useMaquinaStatus } from "./hooks/useMaquinaStatus";
import { maquinaStatusConfig } from "./config/maquinaChartConfig";

export function MaquinaStatusWidget() {
  const { data, loading, error } = useMaquinaStatus();

  if (loading) return <p className="text-sm text-muted-foreground">Carregando...</p>;
  if (error)   return <p className="text-sm text-destructive">Erro ao carregar status.</p>;
  if (!data) return <p className="text-xs text-muted-foreground">Nenhum dado encontrado.</p>;
  if (Array.isArray(data) && data.length === 0) return <p className="text-xs text-muted-foreground">Nenhum registro disponível.</p>;


  return (
    <CustomPieChart
      title="Status das Máquinas"
      data={data}
      config={maquinaStatusConfig}
      dataKey="value"
    />
  );
}