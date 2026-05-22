"use client";

import { BarStackedHorizontal } from "@/components/ui/charts/components/BarStackedHorizontal";
import { useProducaoDefeitos } from "./hooks/useProducaoDefeitos";
import { producaoDefeitosConfig } from "./config/maquinaChartConfig";

export function ProducaoDefeitosWidget({ setorId }) {
  const { data, loading, error } = useProducaoDefeitos(setorId);

  if (loading) return <p className="text-sm text-muted-foreground">Carregando...</p>;
  if (error)   return <p className="text-sm text-destructive">Erro ao carregar dados.</p>;
  if (!data) return <p className="text-xs text-muted-foreground">Nenhum dado encontrado.</p>;
  if (Array.isArray(data) && data.length === 0) return <p className="text-xs text-muted-foreground">Nenhum registro disponível.</p>;


  return (
    <div>
      <p className="text-sm font-semibold text-black">
        Produção de peças com defeitos 
      </p>
      <p className="text-xs text-gray-400 font-semibold mt-1">
        *Atualizado em tempo real
      </p>

      <div className="mt-2">
        <BarStackedHorizontal
          data={data}
          config={producaoDefeitosConfig}
          xKey="maquina"
        />
      </div>
    </div>
  );
}