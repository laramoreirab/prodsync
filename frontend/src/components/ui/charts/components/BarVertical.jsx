"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
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
  colorKey,
  heightClassName,
}) {

  if (loading) return <p className="text-xs text-muted-foreground">Sincronizando...</p>;
  if (error) return <p className="text-sm text-destructive">Erro ao carregar dados.</p>;
  if (!data?.length) return null;

  // Pegamos todas as chaves do config para gerar as barras automaticamente
  const keys = Object.keys(config);

  return (
    <div className="relative">
      {title && (
        <div className="absolute top-0 left-0 z-10 text-left">
          <h3 className="text-sm font-semibold text-foreground">{title}</h3>
          <p className="text-[11px] text-muted-foreground font-medium mt-0.5">Atualizado em tempo real</p>
          {description && (
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
          )}
        </div>
      )}
      <ChartContainer config={config} className={`${heightClassName || "h-[200px]"} w-full pt-12`}>
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
              fill={colorKey ? undefined : `var(--color-${key})`}
              radius={[4, 4, 0, 0]} 
            >
              {colorKey && data.map((entry, index) => (
                <Cell
                  key={`cell-${key}-${index}`}
                  fill={entry[colorKey] || `var(--color-${key})`}
                />
              ))}
            </Bar>
          ))}
        </BarChart>
      </ChartContainer>
    </div>
  );
}
