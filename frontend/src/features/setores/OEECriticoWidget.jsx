"use client";

import { GaugeSemicircular } from "@/components/ui/charts/components/GaugeSemicircular";
import { useOEECritico } from "./hooks/useOEECritico";
import { oeeSetorConfig } from "./config/setoresChartConfig";

export function OEECriticoWidget() {
  const { data, loading, error } = useOEECritico();

  if (loading) return <p className="text-sm text-muted-foreground">Carregando...</p>;
  if (error)   return <p className="text-sm text-destructive">Erro ao carregar OEE crítico.</p>;
  if (!data)   return null;

  return (
    <div className=" bg-white rounded-2xl shadow-sm flex flex-col gap-2">
      <div>
        <h2 className="text-sm font-semibold text-foreground">Setor com OEE mais crítico</h2>
        <p className="text-xs text-muted-foreground">Atualizado em tempo real</p>
      </div>

      <div className="flex items-center justify-center py-4">
        <div className="flex flex-col items-center">
          <GaugeSemicircular
            title={data.setor} 
            data={[{ value: data.oee, fill: "#004aad" }]}
            size="lg"
            config={oeeSetorConfig || { oee: {} }} 
          />
          
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground mt-1">
            Desempenho Crítico
          </span>
        </div>
      </div>
    </div>
  );
}