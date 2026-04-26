"use client";

import { useAndonRanking } from "./hooks/useAndonRanking";
import { BarHorizontal } from "@/components/ui/charts/components/BarHorizontal";

const rankingConfig = {
  produtividade: {
    label: "Produtividade:",
    color: "#7d95c6",
  },
};

export function AndonRankingWidget() {
  const { data, loading, error } = useAndonRanking();

  if (loading) return <p className="text-sm text-muted-foreground">Carregando...</p>;
  if (error)   return <p className="text-sm text-destructive">Erro ao carregar ranking.</p>;

  return (
    <div>
      <p className="text-sm font-semibold text-black mb-3">Ranking de Produtividade</p>
      <BarHorizontal
        data={data}
        config={rankingConfig}
      />
    </div>
  );
}