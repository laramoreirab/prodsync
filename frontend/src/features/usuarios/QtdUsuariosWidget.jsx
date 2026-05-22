"use client";

import { KPI } from "@/components/ui/charts/components/KPI";import { useQtdUsuariosPorPerfil } from "./hooks/useQtdUsuariosPorPerfil";
import { qtdUsuariosPerfilConfig } from "./config/usuarioChartConfig";

export function QtdUsuariosWidget() {
  const { data, loading, error } = useQtdUsuariosPorPerfil();
  

 if (loading) return <p className="text-sm text-muted-foreground">Carregando...</p>;
  if (error) return <p className="text-sm text-destructive">Erro ao carregar status.</p>;
   if (!data) return <p className="text-xs text-muted-foreground">Nenhum dado encontrado.</p>;
  if (Array.isArray(data) && data.length === 0) return <p className="text-xs text-muted-foreground">Nenhum registro disponível.</p>;

    const operadores = data.find((item) => {
      const name = item.name?.toLowerCase();
      return name === "operador" || name === "operadores";
    })?.value ?? 0;
  return (
    <div className="h-full">
      <KPI title="Quantidade de operadores" value={operadores} />
    </div>
    );
  }
