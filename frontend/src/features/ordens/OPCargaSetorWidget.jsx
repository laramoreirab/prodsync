"use client";

import { BarVerticalBase, ChartWidgetShell } from "@/components/ui/charts/components";
import { useOPCargaSetor } from "./hooks/useOPCargaSetor";
import { opCargaSetorConfig } from "./config/ordensChartConfig";

export function OPCargaSetorWidget() {
  const { data, loading, error } = useOPCargaSetor();

  return (
    <ChartWidgetShell
      title="Carga de Trabalho por Setor"
      loading={loading}
      error={error}
      empty={!data || (Array.isArray(data) && data.length === 0)}
      className="p-1"
    >
      <BarVerticalBase
        data={data}
        config={opCargaSetorConfig}
        xKey="setor"
        yKey="carga"
        chartSize="default"
      />
    </ChartWidgetShell>
  );
}
