"use client";

import { GaugeSemicircular } from "@/components/ui/charts/components/GaugeSemicircular";
import { useOEEMaquina } from "./hooks/useOEEMaquina";
import { oeeMetricasMaquinaConfig } from "./config/maquinaDetalheConfig";

export function OEEMaquinaWidget({ maquinaId }) {
  const { data, loading, error } = useOEEMaquina(maquinaId);

  // Feedbacks de carregamento e erros padronizados com o layout base
  if (loading) return <p className="text-sm text-muted-foreground p-4">Carregando OEE...</p>;
  if (error) return <p className="text-sm text-destructive p-4">Erro ao carregar OEE.</p>;
  if (!data) return <p className="text-xs text-muted-foreground p-4">Nenhum dado encontrado.</p>;
  if (Array.isArray(data) && data.length === 0) return <p className="text-xs text-muted-foreground p-4">Nenhum registro disponível.</p>;

  // Separação de lógica igual ao componente base
  const metricaOeeGeral = oeeMetricasMaquinaConfig.find((m) => m.key === "oee");
  const metricasSecundarias = oeeMetricasMaquinaConfig.filter((m) => m.key !== "oee");

  return (
    <div className="flex flex-col gap-1 w-full p-4 h-full justify-between">
      {/* Cabeçalho */}
      <div className="text-left w-full">
        <h2 className="text-sm font-semibold tracking-tight text-foreground">
          Resumo OEE geral da Máquina
        </h2>
        <p className="text-[10px] text-muted-foreground">Atualizando em tempo real</p>
      </div>

      {/* Container dos Gráficos */}
      <div className="flex flex-col gap-1 w-full items-center">
        
        {/* Gráfico Principal (OEE da Máquina) */}
        {metricaOeeGeral && (
          <div className="flex flex-col items-center justify-center rounded-lg w-full">
            <GaugeSemicircular
              title={metricaOeeGeral.label}
              data={[{ value: data[metricaOeeGeral.key], fill: metricaOeeGeral.color }]}
              size="xlg"
              config={{
                value: { label: metricaOeeGeral.label, color: metricaOeeGeral.color },
              }}
            />
          </div>
        )}

        {/* Gráficos Secundários (Disponibilidade, Performance, Qualidade) */}
        <div className="-mt-8 grid grid-cols-3 gap-0.5 w-full items-start justify-items-center">
          {metricasSecundarias.map(({ key, label, color }) => (
            <div key={key} className="flex flex-col items-center justify-center w-full">
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