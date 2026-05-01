"use client";
import { DonutChart } from "@/components/ui/charts/components/DonutChart";
import { useProdutividadeDia } from "./hooks/useProdutividadeDia";
import { produtividadeDiariaConfig } from "./config/operadorConfig";


export function ProdutividadeDiariaWidget({ operadorId }) {
  const { data, loading, error } = useProdutividadeDia(operadorId);
  if (loading) return <p className="text-sm text-muted-foreground">Carregando...</p>;
  if (error)   return <p className="text-sm text-destructive">Erro.</p>;

  const chartData = [
    { name: "produzido", value: data.produzido },
    { name: "meta",      value: data.meta },
  ];

  return (
    <div>
      <p className="text-sm font-semibold text-black">Produtividade Diária</p>
      <p className="text-xs text-gray-400 font-semibold mt-1">*Atualizado em tempo real</p>
      <DonutChart data={chartData} config={produtividadeDiariaConfig} dataKey="value" nameKey="name" />
    </div>
  );
}