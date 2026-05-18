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
    <div>
      <p className="text-sm font-semibold text-black">Turnos com Maior Número de Operadores</p>
      <p className="text-xs text-gray-400 font-semibold mt-1">*Atualizado em tempo real</p>

      <div className="mt-4">
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