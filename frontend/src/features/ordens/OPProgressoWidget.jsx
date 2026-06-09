"use client";

import { useOPProgresso } from "./hooks/useOPProgresso";
import { CustomPieChart } from "@/components/ui/charts/components/PieChart";

const progressoConfig = {
  produzidos: { label: "Produzidos", color: "#00357a" },
  aProduzir: { label: "A Produzir", color: "#b0bfd8" },
};

export function OPProgressoWidget({ opId }) {
  const { data, loading, error } = useOPProgresso(opId);

  if (loading) return <p className="text-sm text-muted-foreground">Carregando...</p>;
  if (error) return <p className="text-sm text-destructive">Erro ao carregar progresso.</p>;
  if (!data) return <p className="text-xs text-muted-foreground">Nenhum dado encontrado.</p>;
  if (Array.isArray(data) && data.length === 0) return <p className="text-xs text-muted-foreground">Nenhum registro disponível.</p>;

  const chartData = [
    { name: "produzidos", value: data.produzidos },
    { name: "aProduzir", value: data.aProduzir },
  ];

  return (
    <div>
      <p className="text-sm font-semibold text-black">Progresso até término da OP</p>
          <p className="text-[11px] text-muted-foreground font-medium mt-0.5">Atualizado em tempo real</p>
      <div className="mt-2 flex justify-center">
        <CustomPieChart
          data={chartData}
          config={progressoConfig}
          dataKey="value"
          nameKey="name"
          showLegend
        />
      </div>
    </div>
  );
}
