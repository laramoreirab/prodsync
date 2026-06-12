"use client";

import { BarVerticalBase } from "@/components/ui/charts/components/BarVertical";
import { useOEEPorSetor } from "./hooks/ueseOEEPorSetor";
import { oeeSetorConfig } from "./config/setoresChartConfig";

export function OEEPorSetorWidget() {
  const { data, loading, error } = useOEEPorSetor();

   if (loading) return <p className="text-sm text-muted-foreground">Sincronizando...</p>;
  if (error) return <p className="text-sm text-destructive">Erro ao carregar OEE crítico.</p>;
   if (!data) return <p className="text-xs text-muted-foreground">Nenhum dado encontrado.</p>;
  if (Array.isArray(data) && data.length === 0) return <p className="text-xs text-muted-foreground">Nenhum registro disponível.</p>;


  return (
    <div className="w-full h-full"> 
      <BarVerticalBase
        title="OEE Médio por Setor"
        data={data}
        config={oeeSetorConfig}
        loading={loading}
        error={error}
        xKey="setor"
        yKey="oee"
      />
    </div>
  );
}