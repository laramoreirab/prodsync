"use client";

import { useMaquinasPorTurno } from "./hooks/useMaquinasPorTurno";
import { maquinasTurnoConfig } from "./config/maquinaChartConfig";

import {
  Bar,
  BarChart,
  LabelList,
  XAxis,
  YAxis,
} from "recharts";

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export function MaquinasPorTurnoWidget({ setorId }) {
  const { data, loading, error } = useMaquinasPorTurno(setorId);

  if (loading) return <p className="text-sm text-muted-foreground">Sincronizando...</p>;
  if (error) return <p className="text-sm text-destructive">Erro ao carregar dados.</p>;
  if (!data) return <p className="text-xs text-muted-foreground">Nenhum dado encontrado.</p>;
  if (Array.isArray(data) && data.length === 0) return <p className="text-xs text-muted-foreground">Nenhum registro disponível.</p>;

  const dataWithPercentages = data?.map((item) => {
    const total = (item.ativas || 0) + (item.paradas || 0) + (item.manutencao || 0);

    if (total === 0) {
      return { ...item, ativasPct: 0, paradasPct: 0, manutencaoPct: 0 };
    }

    return {
      ...item,
      ativasPct: Math.round((item.ativas / total) * 100),
      paradasPct: Math.round((item.paradas / total) * 100),
      manutencaoPct: Math.round((item.manutencao / total) * 100),
    };
  }) || [];

  const localConfig = {
    ativasPct: {
      label: maquinasTurnoConfig.ativas?.label || "Ativas",
      color: maquinasTurnoConfig.ativas?.color || "currentColor",
    },
    paradasPct: {
      label: maquinasTurnoConfig.paradas?.label || "Paradas",
      color: maquinasTurnoConfig.paradas?.color || "currentColor",
    },
    manutencaoPct: {
      label: maquinasTurnoConfig.manutencao?.label || "Setup",
      color: maquinasTurnoConfig.manutencao?.color || "currentColor",
    },
  };

  return (
    <div>
      <p className="text-sm font-semibold text-black">
        Status das máquinas por Turno
      </p>
          <p className="text-[11px] text-muted-foreground font-medium mt-0.5">Atualizado em tempo real</p>


      <div className="mt-2">
        <ChartContainer config={localConfig} className="h-[280px] w-full">
          <BarChart data={dataWithPercentages} margin={{ top: 10, bottom: 5 }}>
            <XAxis dataKey="turno" tickLine={false} axisLine={false} />

            <YAxis
              domain={[0, 100]}
              tickFormatter={(v) => `${v}%`}
              tickLine={false}
              axisLine={false}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value, name, entry) => {
                    const keyMap = {
                      ativasPct: "ativas",
                      paradasPct: "paradas",
                      manutencaoPct: "manutencao"
                    };

                    const originalKey = keyMap[entry.dataKey];
                    const quantidade = entry.payload[originalKey] || 0;
                    const valorFormatado = `${quantidade} ${quantidade === 1 ? 'máquina' : 'máquinas'}`;

                    return [valorFormatado, entry.name];
                  }}
                />
              }
            />

            <ChartLegend content={<ChartLegendContent />} />

            <Bar dataKey="ativasPct" name="Ativas" stackId="turno" fill="var(--color-ativasPct)">
              <LabelList
                dataKey="ativasPct"
                position="center"
                formatter={(v) => `${v}%`}
                style={{ fill: "white", fontSize: 11, fontWeight: 600 }}
              />
            </Bar>

            <Bar dataKey="paradasPct" name="Paradas" stackId="turno" fill="var(--color-paradasPct)">
              <LabelList
                dataKey="paradasPct"
                position="center"
                formatter={(v) => `${v}%`}
                style={{ fill: "white", fontSize: 11, fontWeight: 600 }}
              />
            </Bar>

            <Bar dataKey="manutencaoPct" name="Setup" stackId="turno" fill="var(--color-manutencaoPct)" radius={[4, 4, 0, 0]}>
              <LabelList
                dataKey="manutencaoPct"
                position="center"
                formatter={(v) => `${v}%`}
                style={{ fill: "white", fontSize: 11, fontWeight: 600 }}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </div>
    </div>
  );
}
