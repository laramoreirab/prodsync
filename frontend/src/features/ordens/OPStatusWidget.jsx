"use client";

import { ChartWidgetShell, CustomPieChart } from "@/components/ui/charts/components";
import { useOPStatus } from "./hooks/useOPStatus";
import { opStatusConfig } from "./config/ordensChartConfig";

export function OPStatusWidget() {
  const { data, loading, error } = useOPStatus();

  return (
    <ChartWidgetShell
      title="Status das Ops"
      loading={loading}
      error={error}
      empty={!data || (Array.isArray(data) && data.length === 0)}
      className="p-5"
    >
      <CustomPieChart
        data={data}
        config={opStatusConfig}
        dataKey="value"
        chartSize="compact"
        compact
      />
    </ChartWidgetShell>
  );
}
