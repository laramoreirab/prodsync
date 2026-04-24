"use client";

import { BarVerticalBase } from "@/components/ui/charts/components/BarVertical";
import { useOEEPorSetor } from "./hooks/ueseOEEPorSetor";
import { oeeSetorConfig } from "./config/setoresChartConfig";

export function OEEPorSetorWidget() {
  const { data, loading, error } = useOEEPorSetor();

  return (
    <div className="p-1 h-full">
      <BarVerticalBase
        title="OEE Médio por Setor"
        description="*Atualizado em tempo real"
        data={data}
        config={oeeSetorConfig}
        loading={loading}
        error={error}
        xKey="setor"
        yKey="oee"
      />
    </div>
  );
}