"use client";

import { BarHorizontal } from "@/components/ui/charts/components/BarHorizontal";
import { useRefugoPorSetor } from "./hooks/useRefugoPorSetor";
import { refugoSetorConfig } from "./config/setoresChartConfig";

export function RefugoPorSetorWidget() {
  const { data, loading, error } = useRefugoPorSetor();

  if (loading) return <p className="text-sm text-muted-foreground">Carregando...</p>;
  if (error)   return <p className="text-sm text-destructive">Erro ao carregar refugo.</p>;

  return (
    <div className="p-5 h-full">

      <header>
        <p className="text-sm font-semibold text-black">
          Setores com mais produção de peças em refugo
        </p>
        <p className="text-xs text-gray-400 font-semibold mt-1">
          *Atualizado em tempo real
        </p>
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