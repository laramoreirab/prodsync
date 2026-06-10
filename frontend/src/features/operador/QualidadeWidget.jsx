"use client";
import { CustomPieChart } from "@/components/ui/charts/components/PieChart";
import { useQualidade } from "./hooks/useQualidade";

const config = {
  pecasBoas: { label: "Peças Boas:", color: "#00357a" },
  refugo: { label: "Refugo:", color: "#7d95c6" },
};

export function QualidadeWidget({ operadorId }) {
  const { data, loading, error } = useQualidade(operadorId);
  if (loading) return <p className="text-sm text-muted-foreground">Carregando...</p>;
  if (error) return <p className="text-sm text-destructive">Erro.</p>;
  if (!data) return <p className="text-xs text-muted-foreground">Nenhum dado encontrado.</p>;
  if (Array.isArray(data) && data.length === 0) return <p className="text-xs text-muted-foreground">Nenhum registro disponível.</p>;
  const chartData = [
    { name: "pecasBoas", value: data.pecasBoas },
    { name: "refugo", value: data.refugo },
  ];

  return (
    <div>
      <p className="text-sm font-semibold text-black">Média de Qualidade</p>
          <p className="text-[11px] text-muted-foreground font-medium mt-0.5">Atualizado em tempo real</p>
      <CustomPieChart data={chartData} config={config} dataKey="value" showLegend />
    </div>
  );
}
