"use client";

import {
    CartesianGrid,
    Line,
    LineChart,
    XAxis,
    YAxis,
  } from "recharts";
  
  import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
  } from "@/components/ui/chart";

// ============================================================
// LINE CHART 
// ============================================================

export function LineChartBase({
  title,
  description,
  data,
  xKey,
  yKeys,
  config,
  loading,
  error,
}) {
  
  if (loading) return <p className="text-xs text-muted-foreground">Carregando...</p>;
  if (error) return <p className="text-xs text-red-500">Erro ao carregar dados.</p>;

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
      <ChartContainer config={config} className="h-[200px] w-full pt-12">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey={xKey} tickLine={false} axisLine={false} />
          <YAxis tickLine={false} axisLine={false} width={30} /> 
          <ChartTooltip content={<ChartTooltipContent />} />

          {yKeys.map((key) => ( // ← renderiza uma linha pra cada key
            <Line
              key={key}
              type="monotone"
              dataKey={key}
              stroke={config[key]?.color ?? "#3b82f6"}
              strokeWidth={2}
              dot={{ r: 3 }}
            />
          ))}
        </LineChart>
      </ChartContainer>
    </div>
  );
}

{/* <LineChartBase
  title="Vendas e Receita"
  data={data}
  xKey="month"
  yKeys={["sales", "revenue"]} // ← array
  config={chartConfig}
  loading={loading}
  error={error}
/> */}
