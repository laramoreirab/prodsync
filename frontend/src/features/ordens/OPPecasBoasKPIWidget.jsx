"use client";
import { KPI } from "@/components/ui/charts/components";
import { useOPPecasBoas } from "./hooks/useOPPecasBoas";

export function OPPecasBoasKPIWidget() {
  const { data, loading, error } = useOPPecasBoas();

  if (loading) return <p className="text-sm text-muted-foreground">Carregando...</p>;
  if (error)   return <p className="text-sm text-destructive">Erro ao carregar dados.</p>;

  return <KPI title={data?.titulo} value={data?.valor} />;
}