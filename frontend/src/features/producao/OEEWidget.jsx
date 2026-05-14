"use client";

import { GaugeSemicircular } from "@/components/ui/charts/components/GaugeSemicircular";
import { useOEE } from "./hooks/useOEE";
import { oeeMetricasConfig } from "./config/producaoChartConfig";
export function OEEWidget() {
  const { data, loading, error } = useOEE();

   if (loading) return <p className="text-xs text-muted-foreground">Carregando...</p>;
 if (error)   return <p className="text-xs text-red-500">Erro ao carregar dados.</p>;
 if (!data)   return <p className="text-xs text-muted-foreground">Nenhum dado encontrado.</p>;
 if (Array.isArray(data) && data.length === 0) return <p className="text-xs text-muted-foreground">Nenhum registro disponível.</p>;
 
  return (
    <div className="flex flex-col gap-2">
      {/* Header */}
      <div>
        <h2 className="text-sm font-semibold text-foreground">Resumo OEE geral da Fábrica</h2>
        <p className="text-xs text-muted-foreground">Atualizando em tempo real</p>
      </div>

      {/* Gauges */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 place-items-center">
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