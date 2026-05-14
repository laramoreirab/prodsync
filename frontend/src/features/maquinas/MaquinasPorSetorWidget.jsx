"use client";

import { BarHorizontal } from "@/components/ui/charts/components/BarHorizontal";
import { useQtdMaquinasPorSetor } from "./hooks/useQtdMaquinasPorSetor";
import { qtdMaquinasPorSetorConfig } from "./config/maquinaChartConfig";

export function MaquinasPorSetorWidget({ setorId }) {
  const { data, loading, error } = useQtdMaquinasPorSetor(setorId);

  return (
    <BarHorizontal
      title="Quantidade de máquinas por setor"
      description="*Atualizado em tempo real"
      data={data}
      config={qtdMaquinasPorSetorConfig}
      loading={loading}
      error={error}
      xKey="setor"
      chartSize="small"
    />
  );
}