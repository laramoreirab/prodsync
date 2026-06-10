"use client";

import { KPI } from "@/components/ui/charts/components/KPI";
import { useQtdUsuariosPorPerfil } from "./hooks/useQtdUsuariosPorPerfil";
import { qtdUsuariosPerfilConfig } from "./config/usuarioChartConfig";

export function QtdUsuariosWidget({ setorId = null }) {
  const { data, loading, error } = useQtdUsuariosPorPerfil(setorId);

  if (loading)
    return <p className="text-sm text-muted-foreground">Carregando...</p>;
  if (error)
    return <p className="text-sm text-destructive">Erro ao carregar status.</p>;
  if (!data)
    return (
      <p className="text-xs text-muted-foreground">Nenhum dado encontrado.</p>
    );
  if (Array.isArray(data) && data.length === 0)
    return (
      <p className="text-xs text-muted-foreground">
        Nenhum registro disponível.
      </p>
    );

  const operadores =
    data.find((item) => {
      const name = item.name?.toLowerCase();
      return name === "operador" || name === "operadores";
    })?.value ?? 0;
  return (
    <div className="flex flex-col w-full h-full">
      {/* ── Header do Widget ── */}
      <div className="shrink-0 mb-4">
        <p className="text-sm font-semibold text-foreground">
          Quantidade de Operadores
        </p>
        <p className="text-[11px] text-muted-foreground font-medium mt-0.5">
          Atualizado em tempo real
        </p>
      </div>


      <div className="flex-1 min-h-0 w-full max-h-[160px]">
        <KPI value={operadores} />
      </div>
    </div>
  );
}
