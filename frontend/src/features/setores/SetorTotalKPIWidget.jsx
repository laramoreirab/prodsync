"use client";

import { useSetorTotalKPI } from "./hooks/useSetorKPI";
import { KPI } from "@/components/ui/charts/components";
export function SetorTotalWidget() {
  const { data, loading, error } = useSetorTotalKPI();

  if (loading) return <p className="text-sm text-muted-foreground">Carregando...</p>;
  if (error) return <p className="text-sm text-destructive">Erro ao carregar produção.</p>;

  return (
    <KPI 
      title={data?.titulo ?? "Número Total de Setores"} 
      value={data?.valor ?? "0"} 
    />
  );
}