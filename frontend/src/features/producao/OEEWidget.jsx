"use client";

import { GaugeSemicircular } from "@/components/ui/charts/components/GaugeSemicircular";
import { useOEE } from "./hooks/useOEE";
import { oeeMetricasConfig } from "./config/producaoChartConfig";
export function OEEWidget() {
  const { data, loading, error } = useOEE();

  if (loading) return <p className="text-sm text-muted-foreground">Carregando OEE...</p>;
  if (error)   return <p className="text-sm text-destructive">Erro ao carregar OEE.</p>;

  return (
    <div className="flex flex-col gap-2">
      {/* Header */}
      <div>
        <h2 className="text-sm font-semibold text-foreground">Resumo OEE geral da Fábrica</h2>
        <p className="text-xs text-muted-foreground">Atualizando em tempo real</p>
      </div>

      {/* Gauges */}
      <div className="flex-col items-end justify-around gap-4">
        {oeeMetricasConfig.map(({ key, label, color }) => (
          <div key={key} className="flex my-4 flex-col items-center">
            <GaugeSemicircular
              title={label}
              data={[{ value: data[key], fill: color }]}
              size={key === "oee" ? "lg" : "default"}
              config={{
                value: { label, color },
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}