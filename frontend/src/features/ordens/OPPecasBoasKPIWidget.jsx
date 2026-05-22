"use client";
import { KPI } from "@/components/ui/charts/components";
import { useOPPecasBoas } from "./hooks/useOPPecasBoas";

export function OPPecasBoasKPIWidget({ setorId = null }) {
  const { data, loading, error } = useOPPecasBoas(setorId);

  if (loading) return <p className="text-sm text-muted-foreground">Carregando...</p>;
  if (error) return <p className="text-sm text-destructive">Erro ao carregar dados.</p>;
  if (!data) return <p className="text-xs text-muted-foreground">Nenhum dado encontrado.</p>;
  if (Array.isArray(data) && data.length === 0) return <p className="text-xs text-muted-foreground">Nenhum registro disponível.</p>;


  return <KPI title={data?.titulo} value={data?.valor} />;
}