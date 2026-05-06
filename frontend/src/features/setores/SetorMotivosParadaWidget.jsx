"use client";

import { BarVerticalBase } from "@/components/ui/charts/components/BarVertical";
import { useSetorMotivosParada } from "./hooks/useSetorMotivosParada";
import { setorMotivosParadaConfig } from "./config/setoresChartConfig";

export function SetorMotivosParadaWidget({ setorId }) {
  const { data, loading, error } = useSetorMotivosParada(setorId);
    if (loading) return <p className="text-xs text-muted-foreground">Carregando...</p>;
  if (error)   return <p className="text-xs text-red-500">Erro ao carregar dados.</p>;
  if (!data)   return <p className="text-xs text-muted-foreground">Nenhum dado encontrado.</p>;
  if (Array.isArray(data) && data.length === 0) return <p className="text-xs text-muted-foreground">Nenhum registro disponível.</p>;
  

  return (
    <div>
      <p className="text-sm font-semibold text-black">Motivos de Parada Frequentes</p>
      <p className="text-xs text-gray-400 font-semibold mt-1">*Atualizado em tempo real</p>

      <div className="mt-2">
        <BarVerticalBase
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