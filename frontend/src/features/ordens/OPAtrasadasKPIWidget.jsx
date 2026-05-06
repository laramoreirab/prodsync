"use client";
import { KPI } from "@/components/ui/charts/components";
import { useOPAtrasadas } from "./hooks/useOPAtrasadas";

export function OPAtrasadasKPIWidget() {
  const { data, loading, error } = useOPAtrasadas();

  if (loading) return <p className="text-xs text-muted-foreground">Carregando...</p>;
if (error)   return <p className="text-xs text-red-500">Erro ao carregar dados.</p>;
if (!data)   return <p className="text-xs text-muted-foreground">Nenhum dado encontrado.</p>;
if (Array.isArray(data) && data.length === 0) return <p className="text-xs text-muted-foreground">Nenhum registro disponível.</p>;

  return <KPI title={data?.titulo} value={data?.valor} />;
}