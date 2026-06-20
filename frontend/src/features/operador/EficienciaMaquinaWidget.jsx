"use client";
import { EmptyChartState } from "@/components/ui/empty-chart-state";

import { useEficienciaMaquina } from "./hooks/useEficienciaMaquina";
import { AreaChartBase } from "@/components/ui/charts/components/AreaChart";
import { eficienciaConfig } from "@/features/operador/config/operadorConfig"


export function EficienciaMaquinaWidget({ operadorId }) {
  const { data, loading, error } = useEficienciaMaquina(operadorId);

  if (loading) return <p className="text-sm text-muted-foreground">Sincronizando...</p>;
  if (error) return <p className="text-sm text-destructive">Erro ao carregar eficiência.</p>;
  if (!data) return <EmptyChartState title={"Eficiência da Máquina por Dia"} message={"Nenhum dado encontrado."} />;
  if (Array.isArray(data) && data.length === 0) return <EmptyChartState title={"Eficiência da Máquina por Dia"} message={"Nenhum registro de eficiência disponível."} />;


  const formattedData = data?.map(item => ({
    ...item,
    dia: item.dia,
    eficiencia: Number(item.eficiencia ?? 0),
  }));

  const formatarTooltipEficiencia = (value, name, item) => {
    const numero = Number(value);
    const valorFormatado = Number.isFinite(numero)
      ? numero.toLocaleString("pt-BR", { maximumFractionDigits: 1 })
      : value;
    const label = eficienciaConfig[item.dataKey]?.label ?? name;

    return (
      <>
        <div
          className="h-2.5 w-2.5 shrink-0 rounded-[2px]"
          style={{ backgroundColor: item.color }}
        />
        <div className="flex flex-1 items-center justify-between leading-none">
          <span className="text-muted-foreground">{label}</span>
          <span className="font-mono font-medium text-foreground tabular-nums">
            {valorFormatado}%
          </span>
        </div>
      </>
    );
  };

  return (
    <div className="flex flex-col">
      <p className="text-sm font-semibold text-black">Eficiência da Máquina por Dia</p>
          <p className="text-[11px] text-muted-foreground font-medium mt-0.5">Atualizado em tempo real</p>

      <div className="mt-2">
        <AreaChartBase
          data={formattedData}
          xKey="dia"
          yKey="eficiencia"
          config={eficienciaConfig}
          size="pequeno"
          tooltipFormatter={formatarTooltipEficiencia}
        />
      </div>
    </div>
  );
}