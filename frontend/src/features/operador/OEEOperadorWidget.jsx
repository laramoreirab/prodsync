"use client";

import { GaugeSemicircular } from "@/components/ui/charts/components/GaugeSemicircular";
import { useOEEOperador } from "./hooks/useOEEOperador";
import { metricas } from "@/features/operador/config/operadorConfig";

export function OEEOperadorWidget({ operadorId }) {
  const { data, loading, error } = useOEEOperador(operadorId);

  if (loading) return <div className="flex items-center justify-center h-[214px] text-sm text-muted-foreground w-full">Carregando OEE...</div>;
  if (error) return <div className="flex items-center justify-center h-[214px] text-sm text-destructive w-full">Erro ao carregar OEE.</div>;
  if (!data || (Array.isArray(data) && data.length === 0)) {
    return <div className="flex items-center justify-center h-[214px] text-xs text-muted-foreground w-full">Nenhum dado encontrado.</div>;
  }

  const metricaOeeGeral = metricas.find((m) => m.key === "oee");
  const metricasSecundarias = metricas.filter((m) => m.key !== "oee");

  return (
    <div className="flex flex-col w-full h-[214px] justify-between p-0 select-none relative">
      {/* Cabeçalho */}
      <div className="text-left w-full">
        <h2 className="text-sm font-semibold tracking-tight text-foreground">
          OEE Médio da Máquina do Operador
        </h2>
        <p className="text-[10px] text-muted-foreground">Atualizando em tempo real</p>
      </div>

      {/* Container dos Gráficos */}
      <div className="flex flex-col w-full items-center justify-end flex-1 relative mt-2">
        
        {/* Gráfico Principal (OEE Geral do Operador) */}
        {metricaOeeGeral && (
          <div className="flex flex-col items-center justify-center w-full transform scale-95 origin-bottom pb-4 relative">
            <GaugeSemicircular
              title="" 
              data={[{ value: data[metricaOeeGeral.key], fill: metricaOeeGeral.color }]}
              size="md"
              config={{
                value: { label: metricaOeeGeral.label, color: metricaOeeGeral.color },
              }}
            />
          </div>
        )}

        {/* Gráficos Secundários (Disponibilidade, Performance, Qualidade) */}
        <div className="-mt-4 grid grid-cols-3 gap-1 w-full items-start justify-items-center transform scale-90 origin-top">
          {metricasSecundarias.map(({ key, label, color }) => (
            <div key={key} className="flex flex-col items-center justify-center w-full text-center">
              <GaugeSemicircular
                title={label}
                data={[{ value: data[key], fill: color }]}
                size="sm"
                config={{
                  value: { label, color },
                }}
              />
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
