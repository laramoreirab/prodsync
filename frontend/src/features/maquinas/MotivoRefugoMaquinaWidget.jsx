"use client";

import { BarHorizontal } from "@/components/ui/charts/components/BarHorizontal";
import { useMotivoRefugoMaquina } from "./hooks/useMotivoRefugoMaquina";

const motivoRefugoBarConfig = {
  value: { label: "Refugos", color: "var(--chart1)" },
};

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
        <BarHorizontal
          data={chartData}
          config={motivoRefugoBarConfig}
          yKey="name"
          yAxisWidth={160}
          heightClassName={chartData.length > 4 ? "h-[250px]" : "h-[210px]"}
          paddingTopClassName="pt-3"
          showValueLabels
        />
      </div>
    </div>
  );
}
