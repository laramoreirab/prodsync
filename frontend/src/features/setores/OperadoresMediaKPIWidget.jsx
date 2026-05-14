"use client";

import { useOperadoresMediaKPI } from "./hooks/useOperadoresMediaKPI";
import { KPI } from "@/components/ui/charts/components";
export function OperadoresMediaWidget() {
  const { data, loading, error } = useOperadoresMediaKPI();

  if (loading) return <p className="text-sm text-muted-foreground">Carregando...</p>;
  if (error) return <p className="text-sm text-destructive">Erro ao carregar média.</p>;

  return (
    <KPI 
      title={data?.titulo ?? "Número de operadores por setor (média)"} 
      value={data?.valor ?? "0"} 
    />
  );
}