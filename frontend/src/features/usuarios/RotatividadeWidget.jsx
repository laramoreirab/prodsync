"use client";

import { LineMultiplasSeries } from "@/components/ui/charts/components/LineMultiplasSeries";
import { useRotatividade } from "./hooks/useRotatividade";
import { rotatividadeConfig } from "./config/usuarioChartConfig";

export function RotatividadeWidget({ setorId }) {
  const { data, loading, error } = useRotatividade(setorId);

  if (loading) return <p className="text-sm text-muted-foreground">Sincronizando...</p>;
  if (error)   return <p className="text-sm text-destructive">Erro ao carregar dados.</p>;
  if (!data) return <p className="text-xs text-muted-foreground">Nenhum dado encontrado.</p>;
  if (Array.isArray(data) && data.length === 0) return <p className="text-xs text-muted-foreground">Nenhum registro disponível.</p>;


  return (
    <div>
      <p className="text-sm font-semibold text-black">
        Rotatividade de Usuários
      </p>
          <p className="text-[11px] text-muted-foreground font-medium mt-0.5">Atualizado em tempo real</p>


      <div className="mt-2">
        <LineMultiplasSeries
          data={data}
          config={rotatividadeConfig}
        />
      </div>
    </div>
  );
}