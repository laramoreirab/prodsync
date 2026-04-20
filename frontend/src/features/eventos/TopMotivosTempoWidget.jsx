"use client";

import { BarHorizontal } from "@/components/ui/charts/components/BarHorizontal";
import { useTopMotivosTempo } from "./hooks/useTopMotivosTempo";
import { topMotivosTempoConfig } from "./config/topMotivosTempoConfig";

export function TopMotivosTempoWidget() {
  const { data, loading, error } = useTopMotivosTempo();

  if (loading) return <p className="text-sm text-muted-foreground">Carregando...</p>;
  if (error)   return <p className="text-sm text-destructive">Erro ao carregar motivos.</p>;

  return (
    <div className="p-5 h-full">
      <header>
        <p className="text-sm font-semibold text-black">
          Top 3 Motivos de Parada (Tempo)
        </p>
        <p className="text-xs text-gray-400 font-semibold mt-1">
          *Atualizado em tempo real
        </p>
      </header>

      <div className="mt-2">
        <BarHorizontal
          data={data}
          config={topMotivosTempoConfig}
        />
      </div>
    </div>
  );
}