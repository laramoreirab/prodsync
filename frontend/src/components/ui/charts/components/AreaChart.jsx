"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";
  
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

function useChart(config, key) {
  const item = config?.[key];

  return {
    color: item?.color || "var(--primary)",
  };
}

// Mapeamento de tamanhos para classes do Tailwind
const sizeVariants = {
  pequeno: "h-[180px]",
  medio: "h-[300px]",
  grande: "h-[450px]",
};

// ============================================================
// AREA CHART (variação do LineChart com área preenchida)
// ============================================================

export function AreaChartBase({
  title,
  description,
  data,
  xKey,
  yKey,
  config,
  size = "medio", // Tamanho padrão caso nenhum seja informado
}) {
  const { color } = useChart(config, yKey);
  const gradientId = `grad-${yKey}`;

  // Garante que o tamanho selecionado existe, senão usa o padrão 'medio'
  const heightClass = sizeVariants[size] || sizeVariants.medio;

  return (
    <div className="relative">
      {title && (
        <div className="absolute top-0 left-0 z-10 text-left">
          <h3 className="text-sm font-semibold text-foreground">{title}</h3>
          <p className="text-[11px] text-muted-foreground font-medium mt-0.5">Atualizado em tempo real</p>
          {description && (
            <p className="text-xs text-muted-foreground mt-1">
              {description}
            </p>
          )}
        </div>
      )}

      {/* A classe de altura agora é dinâmica com base no 'size' */}
      <ChartContainer config={config} className={`${heightClass} w-full pt-12`}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey={xKey} />
          <YAxis hide />

          <ChartTooltip content={<ChartTooltipContent />} />

          <Area
            type="monotone"
            dataKey={yKey}
            stroke={color}
            fill={`url(#${gradientId})`}
          />
        </AreaChart>
      </ChartContainer>
    </div>
  );
}
