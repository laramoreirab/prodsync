"use client";

import { BarHorizontal } from "@/components/ui/charts/components/BarHorizontal";
import { useRefugoPorSetor } from "./hooks/useRefugoPorSetor";
import { refugoSetorConfig } from "./config/setoresChartConfig";

export function RefugoPorSetorWidget() {
  const { data, loading, error } = useRefugoPorSetor();

  if (loading) return <p className="text-sm text-muted-foreground">Carregando...</p>;
  if (error)   return <p className="text-sm text-destructive">Erro ao carregar refugo.</p>;
   if (!data) return <p className="text-xs text-muted-foreground">Nenhum dado encontrado.</p>;
  if (Array.isArray(data) && data.length === 0) return <p className="text-xs text-muted-foreground">Nenhum registro disponível.</p>;


  return (
    <div className="p-5 h-full">

      <header>
        <p className="text-sm font-semibold text-black">
          Setores com mais produção de peças em refugo
        </p>
          <p className="text-[11px] text-muted-foreground font-medium mt-0.5">Atualizado em tempo real</p>

      </header>

      <div className="mt-4">
        <BarHorizontal
          data={data}
          config={refugoSetorConfig}
           />
      </div>
    </div>
  );
}