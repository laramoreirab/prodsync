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
      <p className="text-xs text-gray-400 font-semibold mt-1">*Atualizado em tempo real</p>

      <div className="mt-2">
        <BarHorizontal
          data={data}
          xKey="motivo"
          config={setorMotivosParadaConfig}
          loading={loading}
          error={error}
        />
      </div>
    </div>
  );
}