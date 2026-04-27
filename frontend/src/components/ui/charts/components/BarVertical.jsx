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

export function BarVerticalBase({
  title,
  description,
  data,
  config,
  loading,
  error,
  xKey,
}) {

  if (loading) return <p className="text-xs text-muted-foreground">Carregando...</p>;
  if (error) return <p className="text-xs text-red-500">Erro ao carregar dados.</p>;
  if (!data?.length) return null;

  // Pegamos todas as chaves do config para gerar as barras automaticamente
  const keys = Object.keys(config);

  return (
    <div>
      <h3 className="text-sm font-medium mb-3">{title}</h3>
      {description && (
        <p className="text-xs text-muted-foreground mb-3">{description}</p>
      )}
      <ChartContainer config={config} className="h-[200px] w-full">
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