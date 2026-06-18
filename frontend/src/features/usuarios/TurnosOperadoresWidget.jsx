"use client";

import { Cell, Pie, PieChart } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { DonutLegend } from "@/components/ui/charts/components/DonutLegend";
import { useTurnosOperadores } from "./hooks/useTurnosOperadores";
import { turnosOperadoresConfig } from "./config/usuarioChartConfig";

const tonsAzuis = [
  "#1d4ed8",
  "#2563eb",
  "#3b82f6",
  "#60a5fa",
  "#93c5fd",
  "#bfdbfe",
  "#1e40af",
  "#1e3a8a",
];

const MAX_CHART_ITEMS = 6;

export function TurnosOperadoresWidget({ setorId, valueFormatter, compact = false, cy = "50%" }) {
  const { data, loading, error } = useTurnosOperadores(setorId);

  // Estados de carregamento e erro
  if (loading) return <p className="text-xs text-muted-foreground">Sincronizando...</p>;
  if (error) return <p className="text-xs text-red-500">Erro ao carregar dados.</p>;
  if (!data || (Array.isArray(data) && data.length === 0)) {
    return <p className="text-xs text-muted-foreground">Nenhum registro disponível.</p>;
  }

  // Chaves de mapeamento dos dados
  const nameKey = "turno";
  const dataKey = "value";

  const formatValue = (value) => (valueFormatter ? valueFormatter(value) : value);
  const getColor = (entry, index) =>
    turnosOperadoresConfig?.[entry[nameKey]]?.color ?? tonsAzuis[index % tonsAzuis.length];
  const chartData = data
    .filter((entry) => Number(entry[dataKey]) > 0)
    .slice(0, MAX_CHART_ITEMS);
  const legendItems = compact
    ? []
    : chartData.map((entry, index) => ({
          key: `${entry[nameKey]}-${index}`,
          color: getColor(entry, index),
          label: turnosOperadoresConfig?.[entry[nameKey]]?.label ?? entry[nameKey],
        }));
  const chartHeightClass = legendItems.length > 0 ? "h-[144px]" : "h-[160px]";
  const chartMargin = legendItems.length > 0
    ? { top: 4, right: 8, bottom: 4, left: 8 }
    : { top: 8, right: 8, bottom: 8, left: 8 };

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
      <div className="flex-1 min-h-0 w-full">
        <div className={`${chartHeightClass} max-h-full w-full`}>
          <ChartContainer config={turnosOperadoresConfig} className="w-full h-full">
            <PieChart margin={chartMargin}>
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    hideLabel
                    formatter={(value, name, item) => {
                      const entryKey = item?.payload?.[nameKey] ?? name;
                      const color = item?.payload?.fill ?? turnosOperadoresConfig?.[entryKey]?.color;
                      const label = turnosOperadoresConfig?.[entryKey]?.label ?? entryKey;

                      return (
                        <div className="flex w-full items-center justify-between gap-3">
                          <span className="flex items-center gap-1.5 text-muted-foreground">
                            <span
                              className="h-2 w-2 rounded-[2px]"
                              style={{ backgroundColor: color }}
                              aria-hidden="true"
                            />
                            {label}
                          </span>
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
                data={chartData}
                dataKey={dataKey}
                nameKey={nameKey}
                cx="50%"
                cy={cy}
                innerRadius={45}
                outerRadius={70}
                labelLine={false}
                label={false}
              >
                {chartData.map((entry, index) => {
                  const entryKey = entry[nameKey];
                  const fillColor = getColor(entry, index);
                  
                  return <Cell key={entryKey} fill={fillColor} />;
                })}
              </Pie>
            </PieChart>
          </ChartContainer>
        </div>

        <DonutLegend items={legendItems} className="mt-1" />
      </div>
    </div>
  );
}
