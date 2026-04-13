"use client";

import { GaugeSemicircular } from "@/components/ui/charts/components/GaugeSemicircular";
import { useOEE } from "./hooks/useOEE";
import { oeeMetricasConfig } from "./config/producaoChartConfig";

export function OEEWidget() {
  const { data, loading, error } = useOEE();

  if (loading)
    return <p className="text-sm text-muted-foreground">Carregando OEE...</p>;
  if (error)
    return <p className="text-sm text-destructive">Erro ao carregar OEE.</p>;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
      {oeeMetricasConfig.map(({ key, label, color }) => (
        <div key={key} className="w-full flex justify-evenly">
          <div className="w-[140px] flex flex-col items-center">
            <GaugeSemicircular
              title={label}
              data={[{ value: data[key], fill: color }]}
              config={{
                value: { 
                  label, 
                  color,
                  // Ajusta a label/porcentagem interna
                  className: "-translate-y-12 font-bold" 
                },
                title: {
                  // Ajusta o título (label) para subir também, se necessário
                  className: "text-base font-semibold text-gray-900 -translate-y-2",
                },
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
