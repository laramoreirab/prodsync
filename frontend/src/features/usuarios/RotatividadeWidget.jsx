"use client";

import { LineMultiplasSeries } from "@/components/ui/charts/components/LineMultiplasSeries";
import { useRotatividade } from "./hooks/useRotatividade";
import { rotatividadeConfig } from "./config/usuarioChartConfig";

export function RotatividadeWidget() {
  const { data, loading, error } = useRotatividade();

  if (loading) return <p className="text-sm text-muted-foreground">Carregando...</p>;
  if (error)   return <p className="text-sm text-destructive">Erro ao carregar dados.</p>;

  return (
    <div>
      <p className="text-sm font-semibold text-black">
        Rotatividade de Usuários
      </p>
      <p className="text-xs text-gray-400 font-semibold mt-1">
        *Atualizado em tempo real
      </p>

      <div className="mt-2">
        <LineMultiplasSeries
          data={data}
          config={rotatividadeConfig}
        />
      </div>
    </div>
  );
}