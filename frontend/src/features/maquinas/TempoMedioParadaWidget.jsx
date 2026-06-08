"use client";

import { BarVerticalBase } from "@/components/ui/charts/components/BarVertical";
import { useTempoMedioParada } from "./hooks/useTempoMedioParada";
import { tempoMedioParadaConfig } from "./config/maquinaChartConfig";

export function TempoMedioParadaWidget({ setorId = null }) {
  const { data, loading, error } = useTempoMedioParada(setorId);

 if (loading) return <p className="text-sm text-muted-foreground">Carregando...</p>;
  if (error)   return <p className="text-sm text-destructive">Erro ao carregar dados.</p>;
  if (!data) return <p className="text-xs text-muted-foreground">Nenhum dado encontrado.</p>;
  if (Array.isArray(data) && data.length === 0) return <p className="text-xs text-muted-foreground">Nenhum registro disponível.</p>;


  return (
    <div>
      <p className="text-sm font-semibold text-black">
        Tempo médio de parada das máquinas 
      </p>
      <p className="text-xs text-gray-400 font-semibold mt-1">
        *Atualizado em tempo real
      </p>

      <div className="mt-2">
        <BarVerticalBase
          data={data}
          config={tempoMedioParadaConfig}
          xKey="maquina"
          yKey="minutos"
        />
      </div>
    </div>
  );
}
