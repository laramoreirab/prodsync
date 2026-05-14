"use client";

import { useOperadoresMediaKPI } from "./hooks/useOperadoresMediaKPI";
import { KPI } from "@/components/ui/charts/components";
export function OperadoresMediaWidget() {
  const { data, loading, error } = useOperadoresMediaKPI();

    if (loading) return <p className="text-xs text-muted-foreground">Carregando...</p>;
  if (error)   return <p className="text-xs text-red-500">Erro ao carregar dados.</p>;
  if (!data)   return <p className="text-xs text-muted-foreground">Nenhum dado encontrado.</p>;
  if (Array.isArray(data) && data.length === 0) return <p className="text-xs text-muted-foreground">Nenhum registro disponível.</p>;
  
  return (
    <KPI 
      title={data?.titulo ?? "Número de operadores por setor (média)"} 
      value={data?.valor ?? "0"} 
    />
  );
}