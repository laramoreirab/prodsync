"use client";
import { EmptyChartState } from "@/components/ui/empty-chart-state";

import { BarVerticalBase } from "@/components/ui/charts/components/BarVertical";
import { usePecasPorDia } from "./hooks/usePecasPorDia";
import { pecasPorDiaConfig } from "@/features/operador/config/operadorConfig"

export function PecasPorDiaWidget({ operadorId }) {
  const { data, loading, error } = usePecasPorDia(operadorId);
  
  if (loading) return <p className="text-sm text-muted-foreground">Sincronizando peças...</p>;
  if (error) return <p className="text-sm text-destructive">Erro ao carregar peças por dia.</p>;
  if (!data) return <EmptyChartState title={"Peças Produzidas"} message={"Nenhum dado encontrado."} />;
  if (Array.isArray(data) && data.length === 0) return <EmptyChartState title={"Peças Produzidas"} message={"Nenhum registro de peças produzidas disponível."} />;


  return (
    <div className="p-4 ">
      <p className="text-sm font-semibold text-black">
        Peças Produzidas
      </p>
          <p className="text-[11px] text-muted-foreground font-medium mt-0.5">Atualizado em tempo real</p>


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