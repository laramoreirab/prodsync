"use client";

import { useMetaProducao } from "./hooks/useMetaProducao";
import { CustomPieChart } from "@/components/ui/charts/components/PieChart";

const metaConfig = {
  completo: { label: "Completo", color: "#00357a" },
  restante: { label: "Restante", color: "#e2e8f0" },
};

export function MetaProducaoWidget({ operadorId }) {
  const { data, loading, error } = useMetaProducao(operadorId);

  if (loading) return <p className="text-sm text-muted-foreground">Carregando...</p>;
  if (error)   return <p className="text-sm text-destructive">Erro ao carregar meta.</p>;

  const chartData = [
    { name: "completo", value: data.completo },
    { name: "restante", value: data.restante },
  ];

  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm font-semibold text-black">Meta da Produção</p>
      <p className="text-xs text-gray-400 font-semibold">*Atualizado em tempo real</p>

      <CustomPieChart data={chartData} config={metaConfig}>
        <span className="text-3xl font-bold text-black">{data.completo}%</span>
        <span className="text-xs text-gray-400 font-semibold">Completo</span>
      </CustomPieChart>
    </div>
  );
}