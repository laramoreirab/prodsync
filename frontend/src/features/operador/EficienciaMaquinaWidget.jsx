"use client";

import { BarHorizontal, ChartWidgetShell } from "@/components/ui/charts/components";
import { useEficienciaMaquina } from "./hooks/useEficienciaMaquina";
import { eficienciaConfig } from "@/features/operador/config/operadorConfig";

export function EficienciaMaquinaWidget({ operadorId }) {
  const { data, loading, error } = useEficienciaMaquina(operadorId);
  const formattedData = data?.map((item) => ({
    ...item,
    setor: item.dia,
  }));

  return (
    <ChartWidgetShell
      title="Eficiência da Máquina por Dia"
      loading={loading}
      error={error}
      empty={!data || (Array.isArray(data) && data.length === 0)}
    >
      <BarHorizontal
        data={formattedData}
        config={eficienciaConfig}
        chartSize="default"
      />
    </ChartWidgetShell>
  );
}
