"use client";

import { BarHorizontal } from "@/components/ui/charts/components/BarHorizontal";
import { useAndonRanking } from "./hooks/useAndonRanking";

const rankingConfig = {
  produtividade: {
    label: "Produtividade",
    color: "#8aa1d1",
  },
};

export function AndonRankingWidget({ scope = "factory", idSetor = null, title = "Ranking de Produtividade" }) {
  const { data, loading, error } = useAndonRanking(scope, idSetor);

 if (loading) return <p className="text-xs text-muted-foreground">Carregando...</p>;
  if (error) return <p className="text-xs text-red-500">Erro ao carregar dados.</p>;
  if (!data) return <p className="text-xs text-muted-foreground">Nenhum dado encontrado.</p>;
  if (Array.isArray(data) && data.length === 0) return <p className="text-xs text-muted-foreground">Nenhum registro disponível.</p>;

  return (
    <div className="space-y-4">
      <p className="text-md font-semibold text-slate-950">{title}</p>
      <BarHorizontal data={data} config={rankingConfig} />
    </div>
  );
}
