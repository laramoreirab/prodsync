"use client";
import { KPI } from "@/components/ui/charts/components";
import { useOPAtivas } from "./hooks/useOPAtivas";

export function OPAtivasKPIWidget() {
  const { data, loading, error } = useOPAtivas();

  if (loading) return <p className="text-xs text-muted-foreground">Carregando...</p>;
if (error)   return <p className="text-xs text-red-500">Erro ao carregar dados.</p>;
if (!data)   return <p className="text-xs text-muted-foreground">Nenhum dado encontrado.</p>;
if (Array.isArray(data) && data.length === 0) return <p className="text-xs text-muted-foreground">Nenhum registro disponível.</p>;

  return <KPI title={data?.titulo} value={data?.valor} />;
}