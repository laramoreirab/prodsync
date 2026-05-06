"use client";

import { BarComValorETopo } from "@/components/ui/charts/components/BarComValorETopo";
import { useTopOperadores } from "./hooks/useTopOperadores";
import { topOperadoresConfig } from "./config/usuarioChartConfig";

export function TopOperadoresWidget() {
  const { data, loading, error } = useTopOperadores();

   if (loading) return <p className="text-xs text-muted-foreground">Carregando...</p>;
 if (error)   return <p className="text-xs text-red-500">Erro ao carregar dados.</p>;
 if (!data)   return <p className="text-xs text-muted-foreground">Nenhum dado encontrado.</p>;
 if (Array.isArray(data) && data.length === 0) return <p className="text-xs text-muted-foreground">Nenhum registro disponível.</p>;
 
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