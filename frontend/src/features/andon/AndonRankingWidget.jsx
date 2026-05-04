"use client";

import { BarHorizontal } from "@/components/ui/charts/components/BarHorizontal";
import { useAndonRanking } from "./hooks/useAndonRanking";

const rankingConfig = {
  produtividade: {
    label: "Produtividade",
    color: "#8aa1d1",
  },
};

export function AndonRankingWidget({ scope = "factory", title = "Ranking de Produtividade" }) {
  const { data, loading, error } = useAndonRanking(scope);

  if (loading) return <p className="text-sm text-muted-foreground">Carregando...</p>;
  if (error) return <p className="text-sm text-destructive">Erro ao carregar ranking.</p>;

  return (
    <div className="space-y-4">
      <p className="text-sm font-semibold text-slate-950">{title}</p>
      <BarHorizontal data={data} config={rankingConfig} />
    </div>
  );
}
