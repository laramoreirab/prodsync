// src/features/producao/ProducaoSetorWidget.jsx
// Usa o hook e passa os dados para o componente de gráfico genérico. Ele é responsável apenas por lidar com o estado de loading e error, e passar os dados formatados para o gráfico.
"use client";

import { BarHorizontal } from "@/components/ui/charts/components/BarHorizontal";
import { useProducaoSetor } from "./hooks/UseProducaoSetor";
import { producaoSetorConfig } from "./config/producaoChartConfig";

export function ProducaoSetorWidget() {
  const { data, loading, error } = useProducaoSetor();

  if (loading) return <p className="text-sm text-muted-foreground">Carregando...</p>;
  if (error)   return <p className="text-sm text-destructive">Erro ao carregar produção.</p>;

  return (
    <BarHorizontal
      title="Produção por setor"
      data={data}
      config={producaoSetorConfig}
    />
  );
}