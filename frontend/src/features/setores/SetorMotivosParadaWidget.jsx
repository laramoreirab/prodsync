"use client";

import { useSetorMotivosParada } from "./hooks/useSetorMotivosParada";
import { setorMotivosParadaConfig } from "./config/setoresChartConfig";
import { BarHorizontal } from "@/components/ui/charts/components";

export function SetorMotivosParadaWidget({ setorId }) {
  const { data, loading, error } = useSetorMotivosParada(setorId);
  
   if (loading) return <p className="text-sm text-muted-foreground">Carregando...</p>;
  if (error) return <p className="text-sm text-destructive">Erro ao carregar status.</p>;
   if (!data) return <p className="text-xs text-muted-foreground">Nenhum dado encontrado.</p>;
  if (Array.isArray(data) && data.length === 0) return <p className="text-xs text-muted-foreground">Nenhum registro disponível.</p>;


  return (
    <div>
      <p className="text-sm font-semibold text-black">Motivos de Parada Frequentes</p>
          <p className="text-[11px] text-muted-foreground font-medium mt-0.5">Atualizado em tempo real</p>

      <div className="mt-2">
        <BarHorizontal
          data={data}
          xKey="motivo"
          config={setorMotivosParadaConfig}
          loading={loading}
          error={error}
          paddingTopClassName="pt-0"
          showValueLabels
          hideTooltipLabel
        />
      </div>
    </div>
  );
}