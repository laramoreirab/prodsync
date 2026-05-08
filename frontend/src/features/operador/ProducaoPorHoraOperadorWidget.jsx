"use client";

import { AreaChartBase, ChartWidgetShell } from "@/components/ui/charts/components";
import { useProducaoPorHoraOperador } from "./hooks/useProducaoPorHoraOperador";
import { producaoPorHoraConfig } from "@/features/operador/config/operadorConfig";

export function ProducaoPorHoraOperadorWidget({ operadorId }) {
  const { data, loading, error } = useProducaoPorHoraOperador(operadorId);

  return (
    <ChartWidgetShell
      title="Produção por Hora"
      description="Volume de peças produzidas por intervalo"
      loading={loading}
      error={error}
      empty={!data || (Array.isArray(data) && data.length === 0)}
    >
      <AreaChartBase
        data={data}
        config={producaoPorHoraConfig}
        xKey="hora"
        yKey="qtd"
        chartSize="default"
      />
    </ChartWidgetShell>
  );
}
