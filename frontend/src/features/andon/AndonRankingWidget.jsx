"use client";

import { BarHorizontal } from "@/components/ui/charts/components/BarHorizontal";
import { useAndonRanking } from "./hooks/useAndonRanking";

const rankingConfig = {
  produtividade: {
    label: "Produtividade",
    color: "var(--chart-ranking)",
  },
};

export function AndonRankingWidget({ scope = "factory", idSetor = null, title = "Ranking de Produtividade" }) {
  const { data, loading, error } = useAndonRanking(scope, idSetor);

  if (loading) return <p className="text-sm text-muted-foreground">Carregando...</p>;
  if (error) return <p className="text-sm text-destructive">Erro ao carregar ranking.</p>;

  return (
    <div className="space-y-4">
      <p className="text-md font-semibold text-slate-950">{title}</p>
      <BarHorizontal data={data} config={rankingConfig} />
    </div>
  );
}
