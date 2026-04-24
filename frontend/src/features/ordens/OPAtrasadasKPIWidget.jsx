"use client";
import { KPI } from "@/components/ui/charts/components";
import { useOPAtrasadas } from "./hooks/useOPAtrasadas";

export function OPAtrasadasKPIWidget() {
  const { data, loading, error } = useOPAtrasadas();

  if (loading) return <p className="text-sm text-muted-foreground">Carregando...</p>;
  if (error)   return <p className="text-sm text-destructive">Erro ao carregar dados.</p>;

  return <KPI title={data?.titulo} value={data?.valor} />;
}