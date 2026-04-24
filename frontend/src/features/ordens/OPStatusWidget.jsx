"use client";

import { CustomPieChart } from "@/components/ui/charts/components/PieChart";
import { useOPStatus } from "./hooks/useOPStatus";
import { opStatusConfig } from "./config/ordensChartConfig";

export function OPStatusWidget() {
  const { data, loading, error } = useOPStatus();

  if (loading) return <p className="text-sm text-muted-foreground">Carregando...</p>;
  if (error)   return <p className="text-sm text-destructive">Erro ao carregar status.</p>;

  return (
    <div className="p-5 h-full">
      <header>
        <p className="text-sm font-semibold text-black">
          Status das Ops
        </p>
        <p className="text-xs text-gray-400 font-semibold mt-1">
          *Atualizado em tempo real
        </p>
      </header>

      <div className="mt-2">
        <CustomPieChart
          data={data}
          config={opStatusConfig}
          dataKey="value"
        />
      </div>
    </div>
  );
}