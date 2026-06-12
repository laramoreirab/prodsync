"use client";

import { Cell, Pie, PieChart } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useTurnosOperadores } from "./hooks/useTurnosOperadores";
import { turnosOperadoresConfig } from "./config/usuarioChartConfig";

export function TurnosOperadoresWidget({ setorId, valueFormatter, compact = false, cy = "50%" }) {
  const { data, loading, error } = useTurnosOperadores(setorId);

  // Estados de carregamento e erro
  if (loading) return <p className="text-xs text-muted-foreground">Carregando...</p>;
  if (error) return <p className="text-xs text-red-500">Erro ao carregar dados.</p>;
  if (!data || (Array.isArray(data) && data.length === 0)) {
    return <p className="text-xs text-muted-foreground">Nenhum registro disponível.</p>;
  }

  // Chaves de mapeamento dos dados
  const nameKey = "turno";
  const dataKey = "value";

  const formatValue = (value) => (valueFormatter ? valueFormatter(value) : value);
  const renderOuterLabel = (props) => {
    const name = props?.[nameKey] ?? props?.name;
    const value = props?.[dataKey] ?? props?.value;

    return (
      <text
        x={props.x}
        y={props.y}
        textAnchor={props.textAnchor}
        dominantBaseline="central"
        className="fill-black font-medium dark:fill-white"
        style={{ fontSize: "13px" }}
      >
        {`${name}: ${formatValue(value)}`}
      </text>
    );
  };

  return (
    <div className="flex flex-col w-full h-full">
      {/* ── Header do Widget ── */}
      <div className="shrink-0 mb-4">
        <p className="text-sm font-semibold text-foreground">
          Turnos com Maior Número de Operadores
        </p>
        <p className="text-[11px] text-muted-foreground font-medium mt-0.5">
          Atualizado em tempo real
        </p>
      </div>

      {/* ── Renderização do Gráfico (Donut) ── */}
      <div className="flex-1 min-h-0 w-full max-h-[160px]">
        <ChartContainer config={turnosOperadoresConfig} className="w-full h-full">
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  hideLabel
                  formatter={(value, name, item) => {
                    const label =
                      turnosOperadoresConfig?.[item?.payload?.[nameKey]]?.label ?? name;

                    return (
                      <div className="flex w-full items-center justify-between gap-3">
                        <span className="text-muted-foreground">{label}</span>
                        <span className="font-mono font-medium text-foreground tabular-nums">
                          {formatValue(value)}
                        </span>
                      </div>
                    );
                  }}
                />
              }
            />
            <Pie
              data={data}
              dataKey={dataKey}
              nameKey={nameKey}
              cx="50%"
              cy={cy}
              innerRadius={45}
              outerRadius={70}
              label={
                compact
                  ? false
                  : renderOuterLabel
              }
            >
              {data.map((entry) => {
                const entryKey = entry[nameKey];
                const fillColor =
                  turnosOperadoresConfig?.[entryKey]?.color ?? `var(--color-${entryKey})`;
                
                return <Cell key={entryKey} fill={fillColor} />;
              })}
            </Pie>
          </PieChart>
        </ChartContainer>
      </div>
    </div>
  );
}
