"use client";

import { BarVerticalBase } from "@/components/ui/charts/components/BarVertical";
import { usePecasPorDia } from "./hooks/usePecasPorDia";
import { pecasPorDiaConfig } from "@/features/operador/config/operadorConfig"

export function PecasPorDiaWidget({ operadorId }) {
  const { data, loading, error } = usePecasPorDia(operadorId);
  
  if (loading) return <p className="text-sm text-muted-foreground">Carregando peças...</p>;
  if (error) return <p className="text-sm text-destructive">Erro ao carregar peças por dia.</p>;
  if (!data) return <p className="text-xs text-muted-foreground">Nenhum dado encontrado.</p>;
  if (Array.isArray(data) && data.length === 0) return <p className="text-xs text-muted-foreground">Nenhum registro disponível.</p>;


  return (
    <div className="p-4 ">
      <p className="text-sm font-semibold text-black">
        Peças Produzidas
      </p>
      <p className="text-xs text-gray-400 font-semibold mt-1">
        *Atualizado em tempo real
      </p>

      <BarVerticalBase
        data={data}
        config={pecasPorDiaConfig}
        xKey="dia"
        loading={loading}
        error={error}
      />
    </div>
  );
}