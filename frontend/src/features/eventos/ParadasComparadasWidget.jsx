"use client";

import { DonutChart } from "@/components/ui/charts/components";
import { useParadasComparadas } from "./hooks/useParadasComparadas";
import { paradasComparadasConfig } from "./config/paradasComparadasConfig";

export function ParadasComparadasWidget() {
  const { data, loading, error } = useParadasComparadas();

  if (loading) return <p className="text-sm text-muted-foreground">Carregando...</p>;
  if (error)   return <p className="text-sm text-destructive">Erro ao carregar eventos.</p>;

  return (
    <div>
      <p className="text-sm font-semibold text-black">
        Paradas Justificadas x Não Justificadas
      </p>
      <p className="text-xs text-gray-400 font-semibold mt-1">
        *Atualizado em tempo real
      </p>

      <div className="mt-2">
        <DonutChart
          data={data}
          nameKey="name"    
          config={paradasComparadasConfig}
        />
      </div>
    </div>
  );
}