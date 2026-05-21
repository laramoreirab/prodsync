"use client";
import { KPI } from "@/components/ui/charts/components";
import { useOPAtivas } from "./hooks/useOPAtivas";

export function OPAtivasKPIWidget({ setorId = null }) {
  const { data, loading, error } = useOPAtivas(setorId);

  if (loading) return <p className="text-sm text-muted-foreground">Carregando...</p>;
  if (error)   return <p className="text-sm text-destructive">Erro ao carregar dados.</p>;

  return <KPI title={data?.titulo} value={data?.valor} />;
}