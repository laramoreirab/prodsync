"use client";

import { BarStackedVertical } from "@/components/ui/charts/components/BarStackedVertical";
import { useMaquinasPorTurno } from "./hooks/useMaquinasPorTurno";
import { maquinasTurnoConfig } from "./config/maquinaChartConfig";

export function MaquinasPorTurnoWidget() {
  const { data, loading, error } = useMaquinasPorTurno();

  if (loading) return <p className="text-sm text-muted-foreground">Carregando...</p>;
  if (error)   return <p className="text-sm text-destructive">Erro ao carregar dados.</p>;

  return (
    <div>
      <p className="text-sm font-semibold text-black">
        Status das máquinas por Turno
      </p>
      <p className="text-xs text-gray-400 font-semibold mt-1">
        *Atualizado em tempo real
      </p>

      <div className="mt-2">
        <BarStackedVertical
          data={data}
          config={maquinasTurnoConfig}
        />
      </div>
    </div>
  );
}