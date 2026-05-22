"use client";

import { GaugeSemicircular } from "@/components/ui/charts/components/GaugeSemicircular";
import { useOEE } from "./hooks/useOEE";
import { oeeMetricasConfig } from "./config/producaoChartConfig";

export function OEEWidget() {
  const { data, loading, error } = useOEE();

  if (loading) return <p className="text-sm text-muted-foreground">Carregando OEE...</p>;
  if (error) return <p className="text-sm text-destructive">Erro ao carregar OEE.</p>;
  if (!data) return <p className="text-xs text-muted-foreground">Nenhum dado encontrado.</p>;
  if (Array.isArray(data) && data.length === 0) return <p className="text-xs text-muted-foreground">Nenhum registro disponível.</p>;

  const metricasOrdenadas = [...oeeMetricasConfig].sort((a, b) => {
    if (a.key === "oee") return 1;
    if (b.key === "oee") return -1;
    return 0;
  });

  return (
    <div className="flex flex-col gap-6 w-full p-4">
      <div>
        <h2 className="text-sm font-semibold text-foreground">Resumo OEE geral da Fábrica</h2>
        <p className="text-xs text-muted-foreground">Atualizando em tempo real</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 items-end justify-items-center w-full max-w-4xl mx-auto">
        {metricasOrdenadas.map(({ key, label, color }) => (
          <div
            key={key}
            className="flex flex-col items-center justify-center w-full"
          >
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