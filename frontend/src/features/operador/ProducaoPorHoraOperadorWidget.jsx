"use client";

import { AreaChartBase } from "@/components/ui/charts/components/AreaChart";
import { useProducaoPorHoraOperador } from "./hooks/useProducaoPorHoraOperador";
import { producaoPorHoraConfig } from "@/features/operador/config/operadorConfig"

export function ProducaoPorHoraOperadorWidget({ operadorId }) {
  const { data, loading, error } = useProducaoPorHoraOperador(operadorId);

  // Tratamento de estados diretamente antes de renderizar o gráfico
  if (loading) return <p className="text-xs text-muted-foreground">Carregando...</p>;
  if (error)   return <p className="text-xs text-red-500">Erro ao carregar produção.</p>;

  return (
    <AreaChartBase
      title="Produção por Hora"
      description="Volume de peças produzidas por intervalo"
      data={data}
      config={producaoPorHoraConfig}
      xKey="hora"
      yKey="qtd"
    />
  );
}