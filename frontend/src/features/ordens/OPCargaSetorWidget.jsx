"use client";

import { BarVerticalBase } from "@/components/ui/charts/components/BarVertical";
import { useOPCargaSetor } from "./hooks/useOPCargaSetor";
import { opCargaSetorConfig } from "./config/ordensChartConfig";

export function OPCargaSetorWidget() {
  const { data, loading, error } = useOPCargaSetor();

  return (
    <div className="p-1 h-full">
      <BarVerticalBase
        title="Carga de Trabalho por Setor"
        description="*Atualizado em tempo real"
        data={data}
        config={opCargaSetorConfig}
        loading={loading}
        error={error}
        xKey="setor"
        yKey="carga"
      />
    </div>
  );
}