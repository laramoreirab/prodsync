"use client";

import { BarVerticalBase } from "@/components/ui/charts/components/BarVertical";
import { useOPCargaSetor } from "./hooks/useOPCargaSetor";
import { opCargaSetorConfig } from "./config/ordensChartConfig";

export function OPCargaSetorWidget({ setorId = null }) {
  const { data, loading, error } = useOPCargaSetor(setorId);

   if (loading) return <p className="text-sm text-muted-foreground">Carregando...</p>;
  if (error) return <p className="text-sm text-destructive">Erro ao carregar dados.</p>;
  if (!data) return <p className="text-xs text-muted-foreground">Nenhum dado encontrado.</p>;
  if (Array.isArray(data) && data.length === 0) return <p className="text-xs text-muted-foreground">Nenhum registro disponível.</p>;

  
  return (
    <div className="p-1 h-full">
      <BarVerticalBase
        title="Carga Restante por Setor"
        description="*Atualizado em tempo real"
        data={data}
        config={opCargaSetorConfig}
        loading={loading}
        error={error}
        xKey="setor"
        yKey="carga"
      />
    </div>
  );
}
