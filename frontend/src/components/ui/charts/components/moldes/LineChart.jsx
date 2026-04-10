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
    <div>
      <h3 className="text-sm font-medium mb-1">{title}</h3>
      {description && (
        <p className="text-xs text-muted-foreground mb-3">{description}</p>
      )}
      <ChartContainer config={config} className="h-[200px] w-full">
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
              stroke={`var(--color-${key})`}
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