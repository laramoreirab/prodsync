"use client";

import { DonutChart } from "@/components/ui/charts/components/DonutChart";
import { useTurnosOperadores } from "./hooks/useTurnosOperadores";
import { turnosOperadoresConfig } from "./config/usuarioChartConfig";

export function TurnosOperadoresWidget({ setorId }) {
  const { data, loading, error } = useTurnosOperadores(setorId);

  if (loading) return <p className="text-xs text-muted-foreground">Carregando...</p>;
  if (error) return <p className="text-xs text-red-500">Erro ao carregar dados.</p>;
  if (!data) return <p className="text-xs text-muted-foreground">Nenhum dado encontrado.</p>;
  if (Array.isArray(data) && data.length === 0) return <p className="text-xs text-muted-foreground">Nenhum registro disponível.</p>;

   return (
    <div className="flex flex-col w-full h-full">
      <div className="shrink-0">
        <p className="text-sm font-semibold text-foreground">
          Turnos com Maior Número de Operadores
        </p>
        <p className="text-[11px] text-muted-foreground font-medium mt-0.5">
          Atualizado em tempo real
        </p>
      </div>
 
      <div className="flex-1 min-h-0 mt-4">
        <DonutChart
          data={data}
          nameKey="turno"
          dataKey="value"
          config={turnosOperadoresConfig}
        />
      </div>
    </div>
  );
}