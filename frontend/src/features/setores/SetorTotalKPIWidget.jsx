"use client";

import { useSetorTotalKPI } from "./hooks/useSetorKPI";
import { KPIHorizontal } from "@/components/ui/charts/components";
export function SetorTotalWidget() {
  const { data, loading, error } = useSetorTotalKPI();

 if (loading) return <p className="text-sm text-muted-foreground">Sincronizando...</p>;
  if (error) return <p className="text-sm text-destructive">Erro ao carregar status.</p>;
   if (!data) return <p className="text-xs text-muted-foreground">Nenhum dado encontrado.</p>;
  if (Array.isArray(data) && data.length === 0) return <p className="text-xs text-muted-foreground">Nenhum registro disponível.</p>;

  return (
    <KPIHorizontal
      title={data?.titulo ?? "Número Total de Setores"} 
      value={data?.valor ?? "0"} 
    />
  );
}