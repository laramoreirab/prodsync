"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { ChartState } from "./ChartWidgetShell";
import { getChartSize } from "./chartSizes";

export function BarVerticalBase({
  title,
  description,
  data,
  config,
  loading,
  error,
  xKey,
  chartSize = "default",
  heightClassName,
}) {

  if (loading) return <ChartState>Carregando...</ChartState>;
  if (error) return <ChartState type="error">Erro ao carregar dados.</ChartState>;
  if (!data?.length) return null;

  // Pegamos todas as chaves do config para gerar as barras automaticamente
  const keys = Object.keys(config);

  return (
    <div>
      {title && <h3 className="text-sm font-medium mb-3">{title}</h3>}
      {description && (
        <p className="text-xs text-muted-foreground mb-3">{description}</p>
      )}
      <ChartContainer config={config} className={getChartSize(chartSize, heightClassName)}>
        <BarChart data={data} margin={{ top: 10 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis 
            dataKey={xKey} 
            tickLine={false} 
            axisLine={false} 
            tick={{ fontSize: 11 }} 
          />
          <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
          <ChartTooltip content={<ChartTooltipContent />} />
          
          {/* Mapeia as chaves do config para criar uma ou mais barras */}
          {keys.map((key) => (
            <Bar 
              key={key}
              dataKey={key} 
              fill={`var(--color-${key})`} 
              radius={[4, 4, 0, 0]} 
            />
          ))}
        </BarChart>
      </ChartContainer>
    </div>
  );
}
