"use client";
import { EmptyChartState } from "@/components/ui/empty-chart-state";
import { DonutChart } from "@/components/ui/charts/components/DonutChart";
import { useProdutividadeDia } from "./hooks/useProdutividadeDia";
import { produtividadeDiariaConfig } from "./config/operadorConfig";

export function ProdutividadeDiariaWidget({ operadorId }) {
  const { data, loading, error } = useProdutividadeDia(operadorId);

  if (loading) return <p className="text-sm text-muted-foreground">Sincronizando...</p>;
  if (error)   return <p className="text-sm text-destructive">Erro.</p>;
  if (!data) return <EmptyChartState title={"Produtividade Diária"} message={"Nenhum dado encontrado."} />;
  if (Array.isArray(data) && data.length === 0) return <EmptyChartState title={"Produtividade Diária"} message={"Nenhum registro de produtividade disponível."} />;

  const chartData = [
    { name: "produzido", value: data.produzido },
    { name: "meta",      value: data.meta },
  ];

  return (
    <div className="flex flex-col w-full h-full">
      <div className="shrink-0">
        <p className="text-sm font-semibold text-foreground">Produtividade Diária</p>
        <p className="text-[11px] text-muted-foreground font-medium mt-0.5">
          Atualizado em tempo real
        </p>
      </div>

      <div className="flex-1 min-h-0 mt-4">
        <DonutChart
          data={chartData}
          config={produtividadeDiariaConfig}
          dataKey="value"
          nameKey="name"
          innerRadius={55}
          outerRadius={80}
        />
      </div>
    </div>
  );
}
