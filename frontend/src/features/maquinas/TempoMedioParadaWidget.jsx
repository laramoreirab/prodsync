"use client";

import { BarVerticalBase, ChartWidgetShell } from "@/components/ui/charts/components";
import { useTempoMedioParada } from "./hooks/useTempoMedioParada";
import { tempoMedioParadaConfig } from "./config/maquinaChartConfig";

export function TempoMedioParadaWidget() {
  const { data, loading, error } = useTempoMedioParada();

  return (
    <ChartWidgetShell
      title="Tempo médio de parada das máquinas por setor"
      loading={loading}
      error={error}
      empty={!data || (Array.isArray(data) && data.length === 0)}
    >
      <BarVerticalBase
        data={data}
        config={tempoMedioParadaConfig}
        xKey="setor"
        yKey="minutos"
        chartSize="default"
      />
    </ChartWidgetShell>
  );
}
