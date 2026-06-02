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
    <div className="flex flex-col gap-6 w-full p-4 h-full justify-between">
      {/* Cabeçalho */}
      <div className="text-left w-full">
        <h2 className="text-sm font-semibold tracking-tight text-foreground">
          Resumo OEE geral da Máquina
        </h2>
        <p className="text-[10px] text-muted-foreground">Atualizando em tempo real</p>
      </div>

      {/* Container do Conteúdo */}
      <div className="flex flex-col gap-6 w-full items-center flex-1 justify-center">
        
        {/* Gráfico Principal (OEE da Máquina) */}
        {metricaOeeGeral && (
          <div className="flex flex-col items-center justify-center w-full">
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

        {/* Sub-indicadores Lineares (Disponibilidade, Performance, Qualidade) */}
        <div className="w-full space-y-3.5 px-2">
          {metricasSecundarias.map(({ key, label, color }) => {
            const rawValue = data[key];
            const value = Number(rawValue);
            const normalizedValue = Number.isFinite(value) ? Math.max(0, Math.min(100, Math.round(value))) : 0;
            const barColor = color || "#00357a";

            return (
              <div key={key} className="space-y-1">
                {/* Rótulo e Percentual */}
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground font-medium">{label}</span>
                  <span className="font-bold text-foreground">{normalizedValue}%</span>
                </div>
                
                {/* Barra de Progresso Customizada */}
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-500 ease-out"
                    style={{ 
                      width: `${normalizedValue}%`,
                      backgroundColor: barColor 
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}