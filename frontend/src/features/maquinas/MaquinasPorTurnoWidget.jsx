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

  if (loading) return <p className="text-sm text-muted-foreground">Carregando...</p>;
  if (error) return <p className="text-sm text-destructive">Erro ao carregar dados.</p>;
  if (!data) return <p className="text-xs text-muted-foreground">Nenhum dado encontrado.</p>;
  if (Array.isArray(data) && data.length === 0) return <p className="text-xs text-muted-foreground">Nenhum registro disponível.</p>;


  // Tratamento dos dados para converter números absolutos em percentagem
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

  return (
    <div>
      <p className="text-sm font-semibold text-black">
        Status das máquinas por Turno
      </p>
      <p className="text-xs text-gray-400 font-semibold mt-1">
        *Atualizado em tempo real
      </p>

      <div className="mt-2">
        <ChartContainer config={maquinasTurnoConfig} className="h-[250px] w-full">
          <BarChart data={dataWithPercentages} margin={{ top: 10 }}>
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

            <Bar dataKey="ativasPct" name="Ativas" stackId="turno" fill="var(--color-ativas)">
              <LabelList
                dataKey="ativasPct"
                position="center"
                formatter={(v) => `${v}%`}
                style={{ fill: "white", fontSize: 11, fontWeight: 600 }}
              />
            </Bar>

            <Bar dataKey="paradasPct" name="Paradas" stackId="turno" fill="var(--color-paradas)">
              <LabelList
                dataKey="paradasPct"
                position="center"
                formatter={(v) => `${v}%`}
                style={{ fill: "white", fontSize: 11, fontWeight: 600 }}
              />
            </Bar>

            <Bar dataKey="manutencaoPct" name="Manutenção" stackId="turno" fill="var(--color-manutencao)" radius={[4, 4, 0, 0]}>
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