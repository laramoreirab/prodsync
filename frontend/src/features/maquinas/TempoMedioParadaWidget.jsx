"use client";

import { BarVerticalBase, ChartWidgetShell } from "@/components/ui/charts/components";
import { useTempoMedioParada } from "./hooks/useTempoMedioParada";
import { tempoMedioParadaConfig } from "./config/maquinaChartConfig";

export function TempoMedioParadaWidget({ setorId }) {
  const { data, loading, error } = useTempoMedioParada(setorId);

  return (
    <ChartWidgetShell
      title="Tempo médio de parada das máquinas"
      loading={loading}
      error={error}
      empty={!data || (Array.isArray(data) && data.length === 0)}
    >
      <BarVerticalBase
        data={data}
        config={tempoMedioParadaConfig}
        xKey="maquina"
        yKey="minutos"
        chartSize="default"
      />
    </ChartWidgetShell>
  );
}
