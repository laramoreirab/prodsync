"use client";

import { BarHorizontal } from "@/components/ui/charts/components/BarHorizontal";
import { useMotivoRefugoMaquina } from "./hooks/useMotivoRefugoMaquina";
import { motivoRefugoConfig } from "./config/maquinaDetalheConfig";
import { CustomPieChart } from "@/components/ui/charts/components/PieChart";

const tonsAzuis = [
  "#1d4ed8",
  "#2563eb",
  "#3b82f6",
  "#60a5fa",
  "#93c5fd",
  "#bfdbfe",
  "#1e40af",
  "#1e3a8a",
  "#0f4c81",
  "#0284c7",
  "#38bdf8",
  "#7dd3fc",
];
 
export function MotivoRefugoMaquinaWidget({ maquinaId }) {
  const { data, loading, error } = useMotivoRefugoMaquina(maquinaId);

  if (loading) return <p className="text-sm text-muted-foreground">Sincronizando...</p>;
  if (error) return <p className="text-sm text-destructive">Erro ao carregar dados.</p>;
  if (!data) return <p className="text-xs text-muted-foreground">Nenhum dado encontrado.</p>;
  if (Array.isArray(data) && data.length === 0) {
    return <p className="text-xs text-muted-foreground">Nenhum registro disponível.</p>;
  }

  const chartData = [...data]
    .sort((a, b) => Number(b.value) - Number(a.value))
    .slice(0, 6);

  return (
    <div>
      <p className="text-sm font-semibold text-foreground">
        Principais Motivos de Refugo
      </p>
      <p className="mt-0.5 text-[11px] font-medium text-muted-foreground">
        Atualizado em tempo real
      </p>
      <div className="mt-2">
        <CustomPieChart
          data={data.map((item, index) => ({
            ...item,
            fill: item.fill || tonsAzuis[index % tonsAzuis.length],
          }))}
          config={motivoRefugoConfig}
          dataKey="value"
          nameKey="name"
          showLegend
        />
      </div>
    </div>
  );
}
