"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ReferenceLine,
  XAxis,
  YAxis,
} from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import { barHorizontalConfig } from "../config/barHorizontalConfig"; // <= import da config
import { useBarHorizontal } from "../hooks/useBarHorizontal";     // <= import do hook


// ============================================================
//  BAR COM LINHA DE REFERÊNCIA (Sobrecarga de Máquina)
// ============================================================


export function Ex4B_BarComLimite() {
  const { data, loading, error } = useBarHorizontal();
 
  if (loading) return <p className="text-sm text-muted-foreground">Carregando...</p>;
  if (error)   return <p className="text-sm text-destructive">Erro ao carregar dados.</p>;
 
  return (
    <div>
      <h3 className="text-sm font-medium mb-3">Indicador de Sobrecarga por Setor</h3>
      <ChartContainer config={sobrecargaConfig} className="h-[220px] w-full">
        <BarChart data={sobrecargaData} margin={{ top: 10 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="setor" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
          <YAxis domain={[0, 100]} tickFormatter={(v) => `${v}%`} tickLine={false} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar dataKey={data} fill="var(--color-carga)" radius={[4, 4, 0, 0]} />
          <ReferenceLine
            y={60}
            stroke="red"
            strokeDasharray="4 4"
            label={{
              value: "Limite: 60%",
              position: "insideTopRight",
              fontSize: 11,
              fill: "red",
            }}
          />
        </BarChart>
      </ChartContainer>
    </div>
  );
}
