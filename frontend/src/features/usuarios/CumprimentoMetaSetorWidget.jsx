"use client";

import { BarComLimiteDegrade } from "@/components/ui/charts/components/BarComLimiteDegrade";
import { useCumprimentoMetaSetor } from "./hooks/useCumprimentoMetaSetor";
import { cumprimentoMetaConfig } from "./config/usuarioChartConfig";

export function CumprimentoMetaSetorWidget() {
  const { data, loading, error } = useCumprimentoMetaSetor();

  if (loading)
    return <p className="text-sm text-muted-foreground">Sincronizando...</p>;
  if (error)
    return <p className="text-sm text-destructive">Erro ao carregar dados.</p>;
  if (!data)
    return (
      <p className="text-xs text-muted-foreground">Nenhum dado encontrado.</p>
    );
  if (Array.isArray(data) && data.length === 0)
    return (
      <p className="text-xs text-muted-foreground">
        Nenhum registro disponível.
      </p>
    );

  return (
    <div className="flex h-full w-full flex-col">
      <div className="shrink-0">
        <p className="text-lg font-semibold text-black">
          Cumprimento de meta de produção por setor
        </p>
        <p className="text-md text-muted-foreground font-medium mt-0.5">
          Atualizado em tempo real
        </p>
      </div>
      <div className="mt-2 min-h-0 flex-1 flex flex-col justify-center">
        <BarComLimiteDegrade data={data} config={cumprimentoMetaConfig} />
      </div>
    </div>
  );
}
