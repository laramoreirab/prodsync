"use client";

import { useSetorTotalKPI } from "./hooks/useSetorKPI";
import { KPI } from "@/components/ui/charts/components";
export function SetorTotalWidget() {
  const { data, loading, error } = useSetorTotalKPI();

    if (loading) return <p className="text-xs text-muted-foreground">Carregando...</p>;
  if (error)   return <p className="text-xs text-red-500">Erro ao carregar dados.</p>;
  if (!data)   return <p className="text-xs text-muted-foreground">Nenhum dado encontrado.</p>;
  if (Array.isArray(data) && data.length === 0) return <p className="text-xs text-muted-foreground">Nenhum registro disponível.</p>;
  
  return (
    <KPI 
      title={data?.titulo ?? "Número Total de Setores"} 
      value={data?.valor ?? "0"} 
    />
  );
}