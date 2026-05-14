"use client";

import { BarComLimiteDegrade } from "@/components/ui/charts/components/BarComLimiteDegrade";
import { useCumprimentoMetaSetor } from "./hooks/useCumprimentoMetaSetor";
import { cumprimentoMetaConfig } from "./config/usuarioChartConfig";

export function CumprimentoMetaSetorWidget() {
  const { data, loading, error } =  useCumprimentoMetaSetor();

  if (loading) return <p className="text-sm text-muted-foreground">Carregando...</p>;
  if (error)   return <p className="text-sm text-destructive">Erro ao carregar dados.</p>;

  return (
    <div>
      <p className="text-sm font-semibold text-black">
        Cumprimento de meta de produção por setor
      </p>
      <p className="text-xs text-gray-400 font-semibold mt-1">
        *Atualizado em tempo real
      </p>

      <div className="mt-2">
        <BarComLimiteDegrade
          data={data}
          config={cumprimentoMetaConfig}
        />
      </div>
    </div>
  );
}