"use client";

import { BarComLimiteDegrade } from "@/components/ui/charts/components/BarComLimiteDegrade";
import { useCumprimentoMetaSetor } from "./hooks/useCumprimentoMetaSetor";
import { cumprimentoMetaConfig } from "./config/usuarioChartConfig";

export function CumprimentoMetaSetorWidget() {
  const { data, loading, error } =  useCumprimentoMetaSetor();

  if (loading) return <p className="text-sm text-muted-foreground">Sincronizando...</p>;
  if (error)   return <p className="text-sm text-destructive">Erro ao carregar dados.</p>;
  if (!data) return <p className="text-xs text-muted-foreground">Nenhum dado encontrado.</p>;
  if (Array.isArray(data) && data.length === 0) return <p className="text-xs text-muted-foreground">Nenhum registro disponível.</p>;


  return (
    <div>
      <p className="text-sm font-semibold text-black">
        Cumprimento de meta de produção por setor
      </p>
          <p className="text-[11px] text-muted-foreground font-medium mt-0.5">Atualizado em tempo real</p>

      <div className="mt-2">
        <BarComLimiteDegrade
          data={data}
          config={cumprimentoMetaConfig}
        />
      </div>
    </div>
  );
}