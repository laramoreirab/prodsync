"use client";
import { CustomPieChart } from "@/components/ui/charts/components/PieChart";
import { useQualidade } from "./hooks/useQualidade";

const config = {
  pecasBoas: { label: "Peças Boas:", color: "var(--chart-primary)" },
  refugo:    { label: "Refugo:",     color: "var(--chart-accent)" },
};

export function QualidadeWidget({ operadorId }) {
  const { data, loading, error } = useQualidade(operadorId);
  if (loading) return <p className="text-xs text-muted-foreground">Carregando...</p>;
if (error)   return <p className="text-xs text-red-500">Erro ao carregar dados.</p>;
if (!data)   return <p className="text-xs text-muted-foreground">Nenhum dado encontrado.</p>;
if (Array.isArray(data) && data.length === 0) return <p className="text-xs text-muted-foreground">Nenhum registro disponível.</p>;

  const chartData = [
    { name: "pecasBoas", value: data.pecasBoas },
    { name: "refugo",    value: data.refugo },
  ];

  return (
    <div>
      <p className="text-sm font-semibold text-black">Média de Qualidade</p>
      <p className="text-xs text-gray-400 font-semibold mt-1">*Atualizado em tempo real</p>
      <CustomPieChart data={chartData} config={config} dataKey="value" />
    </div>
  );
}