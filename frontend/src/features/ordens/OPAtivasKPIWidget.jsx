"use client";
import { KPIRetangulo } from "@/components/ui/charts/components";
import { useOPAtivas } from "./hooks/useOPAtivas";

export function OPAtivasKPIWidget({ setorId = null }) {
  const { data, loading, error } = useOPAtivas(setorId);

  if (loading) return <p className="text-xs text-muted-foreground">Carregando...</p>;
if (error)   return <p className="text-xs text-red-500">Erro ao carregar dados.</p>;
if (!data)   return <p className="text-xs text-muted-foreground">Nenhum dado encontrado.</p>;
if (Array.isArray(data) && data.length === 0) return <p className="text-xs text-muted-foreground">Nenhum registro disponível.</p>;

  return <KPIRetangulo title={data?.titulo} value={data?.valor} />;
}
