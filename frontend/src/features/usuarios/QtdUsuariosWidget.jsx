"use client";

import { KPI } from "@/components/ui/charts/components/KPI";
import { useQtdUsuariosPorPerfil } from "./hooks/useQtdUsuariosPorPerfil";

export function QtdUsuariosWidget() {
  const { data, loading, error } = useQtdUsuariosPorPerfil();

  if (loading) return <p className="text-xs text-muted-foreground">Carregando...</p>;
  if (error) return <p className="text-xs text-red-500">Erro ao carregar dados.</p>;
  if (!data) return <p className="text-xs text-muted-foreground">Nenhum dado encontrado.</p>;
  if (Array.isArray(data) && data.length === 0) return <p className="text-xs text-muted-foreground">Nenhum registro disponível.</p>;

  const operadores = data.find((item) => item.name.toLowerCase() === "operadores")?.value ?? 0;

  return (
    <div className="h-full">
      <KPI title="Quantidade de operadores" value={operadores} />
    </div>
  );
}