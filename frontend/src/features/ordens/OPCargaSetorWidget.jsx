"use client";

import { BarVerticalBase } from "@/components/ui/charts/components/BarVertical";
import { useOPCargaSetor } from "./hooks/useOPCargaSetor";
import { opCargaSetorConfig } from "./config/ordensChartConfig";

export function OPCargaSetorWidget() {

  const { data, loading, error } = useOPCargaSetor();
  
  if (loading) return <p className="text-xs text-muted-foreground">Carregando...</p>;
  if (error)   return <p className="text-xs text-red-500">Erro ao carregar dados.</p>;
  if (!data)   return <p className="text-xs text-muted-foreground">Nenhum dado encontrado.</p>;
  if (Array.isArray(data) && data.length === 0) return <p className="text-xs text-muted-foreground">Nenhum registro disponível.</p>;
  

  return (
    <div className="p-1 h-full">
      <BarVerticalBase
        title="Carga de Trabalho por Setor"
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