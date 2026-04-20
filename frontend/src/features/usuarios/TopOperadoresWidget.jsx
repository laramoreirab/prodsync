"use client";

import { BarComValorETopo } from "@/components/ui/charts/components/BarComValorETopo";
import { useTopOperadores } from "./hooks/useTopOperadores";
import { topOperadoresConfig } from "./config/usuarioChartConfig";

export function TopOperadoresWidget() {
  const { data, loading, error } = useTopOperadores();

  if (loading) return <p className="text-sm text-muted-foreground">Carregando...</p>;
  if (error)   return <p className="text-sm text-destructive">Erro ao carregar dados.</p>;

  return (
    <div>
      <p className="text-sm font-semibold text-black">
        Top 5 Operadores com mais peças produzidas
      </p>
      <p className="text-xs text-gray-400 font-semibold mt-1">
        *Atualizado em tempo real
      </p>

      <div className="mt-2">
        <BarComValorETopo
          data={data}
          config={topOperadoresConfig}
        />
      </div>
    </div>
  );
}