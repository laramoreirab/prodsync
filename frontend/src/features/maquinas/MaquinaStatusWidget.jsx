"use client";
import { CustomPieChart } from "@/components/ui/charts/components/PieChart";
import { useMaquinaStatus } from "./hooks/useMaquinaStatus";
import { maquinaStatusConfig } from "./config/maquinaChartConfig";

export function MaquinaStatusWidget() {
  const { data, loading, error } = useMaquinaStatus();

  if (loading) return <p className="text-sm text-muted-foreground p-4">Carregando...</p>;
  if (error)   return <p className="text-sm text-destructive p-4">Erro ao carregar status.</p>;
  if (!data) return <p className="text-xs text-muted-foreground p-4">Nenhum dado encontrado.</p>;
  if (Array.isArray(data) && data.length === 0) return <p className="text-xs text-muted-foreground p-4">Nenhum registro disponível.</p>;

  return (

    <div className="w-full max-w-[240px] mx-auto">
      <CustomPieChart
        title="Status das Máquinas"
        data={data}
        config={maquinaStatusConfig}
        dataKey="value"
      />
    </div>
  );
}