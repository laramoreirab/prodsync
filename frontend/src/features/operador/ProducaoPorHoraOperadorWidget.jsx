"use client";

import { AreaChartBase } from "@/components/ui/charts/components/AreaChart";
import { useProducaoPorHoraOperador } from "./hooks/useProducaoPorHoraOperador";
import { producaoPorHoraConfig } from "@/features/operador/config/operadorConfig"

export function ProducaoPorHoraOperadorWidget({ operadorId }) {
  const { data, loading, error } = useProducaoPorHoraOperador(operadorId);

  if (loading) return <p className="text-xs text-muted-foreground">Carregando...</p>;
if (error)   return <p className="text-xs text-red-500">Erro ao carregar dados.</p>;
if (!data)   return <p className="text-xs text-muted-foreground">Nenhum dado encontrado.</p>;
if (Array.isArray(data) && data.length === 0) return <p className="text-xs text-muted-foreground">Nenhum registro disponível.</p>;

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