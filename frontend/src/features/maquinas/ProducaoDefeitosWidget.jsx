"use client";

import { BarStackedHorizontal } from "@/components/ui/charts/components/BarStackedHorizontal";
import { useProducaoDefeitos } from "./hooks/useProducaoDefeitos";
import { producaoDefeitosConfig } from "./config/maquinaChartConfig";

export function ProducaoDefeitosWidget() {
  const { data, loading, error } = useProducaoDefeitos();

  if (loading) return <p className="text-sm text-muted-foreground">Carregando...</p>;
  if (error)   return <p className="text-sm text-destructive">Erro ao carregar dados.</p>;

  return (
    <div>
      <p className="text-sm font-semibold text-black">
        Produção de peças com defeitos por setor
      </p>
      <p className="text-xs text-gray-400 font-semibold mt-1">
        *Atualizado em tempo real
      </p>

      <div className="mt-2">
        <BarStackedHorizontal
          data={data}
          config={producaoDefeitosConfig}
        />
      </div>
    </div>
  );
}