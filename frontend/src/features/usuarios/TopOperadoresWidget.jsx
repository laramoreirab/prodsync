"use client";

import { BarComValorETopo } from "@/components/ui/charts/components/BarComValorETopo";
import { useTopOperadores } from "./hooks/useTopOperadores";
import { topOperadoresConfig } from "./config/usuarioChartConfig";

export function TopOperadoresWidget({ setorId }) {
  const { data, loading, error } = useTopOperadores(setorId);

 if (loading) return <p className="text-xs text-muted-foreground">Sincronizando...</p>;
  if (error) return <p className="text-sm text-destructive">Erro ao carregar dados.</p>;
  if (!data) return <p className="text-xs text-muted-foreground">Nenhum dado encontrado.</p>;
  if (Array.isArray(data) && data.length === 0) return <p className="text-xs text-muted-foreground">Nenhum registro disponível.</p>;
  
  return (
    <div>
      <p className="text-lg font-semibold text-black">
        Top 5 Operadores com mais peças produzidas
      </p>
          <p className="text-md text-muted-foreground font-medium mt-0.5">Atualizado em tempo real</p>


      <div className="mt-2">
        <BarComValorETopo
          data={data}
          config={topOperadoresConfig}
        />
      </div>
    </div>
  );
}