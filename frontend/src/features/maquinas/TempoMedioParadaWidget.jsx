"use client";

import { BarVerticalBase } from "@/components/ui/charts/components/BarVertical";
import { useTempoMedioParada } from "./hooks/useTempoMedioParada";
import { tempoMedioParadaConfig } from "./config/maquinaChartConfig";

export function TempoMedioParadaWidget() {
  const { data, loading, error } = useTempoMedioParada();

  if (loading) return <p className="text-sm text-muted-foreground">Carregando...</p>;
  if (error)   return <p className="text-sm text-destructive">Erro ao carregar dados.</p>;

  return (
    <div>
      <p className="text-sm font-semibold text-black">
        Tempo médio de parada das máquinas por setor
      </p>
      <p className="text-xs text-gray-400 font-semibold mt-1">
        *Atualizado em tempo real
      </p>

      <div className="mt-2">
        <BarVerticalBase
          data={data}
          config={tempoMedioParadaConfig}
          xKey="setor"
          yKey="minutos"
        />
      </div>
    </div>
  );
}