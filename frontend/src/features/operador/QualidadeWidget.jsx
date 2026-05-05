"use client";
import { CustomPieChart } from "@/components/ui/charts/components/PieChart";
import { useQualidade } from "./hooks/useQualidade";

const config = {
  pecasBoas: { label: "Peças Boas:", color: "#00357a" },
  refugo:    { label: "Refugo:",     color: "#7d95c6" },
};

export function QualidadeWidget({ operadorId }) {
  const { data, loading, error } = useQualidade(operadorId);
  if (loading) return <p className="text-sm text-muted-foreground">Carregando...</p>;
  if (error)   return <p className="text-sm text-destructive">Erro.</p>;

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