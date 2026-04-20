"use client";
import { KPI } from "@/components/ui/charts/components";
import { useOPRefugoKPI } from "./hooks/useOPRefugoKPI";

export function OPRefugoKPIWidget() {
  const { data, loading, error } = useOPRefugoKPI();

  if (loading) return <p className="text-sm text-muted-foreground">Carregando...</p>;
  if (error)   return <p className="text-sm text-destructive">Erro ao carregar dados.</p>;

  return <KPI title={data?.titulo} value={data?.valor} />;
}