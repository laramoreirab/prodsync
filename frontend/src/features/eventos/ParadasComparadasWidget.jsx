"use client";

import { DonutChart } from "@/components/ui/charts/components/DonutChart";
import { useParadasComparadas } from "./hooks/useParadasComparadas";
import { paradasComparadasConfig } from "./config/paradasComparadasConfig";

function formatarMinutos(minutosTotais) {
  const total = Math.max(0, Math.round(Number(minutosTotais) || 0));
  const dias = Math.floor(total / 1440);
  const horas = Math.floor((total % 1440) / 60);
  const minutos = total % 60;
  const partes = [];

  if (dias > 0) partes.push(`${dias}d`);
  if (horas > 0) partes.push(`${horas}h`);
  if (minutos > 0 || partes.length === 0) partes.push(`${minutos}min`);

  return partes.join(" ");
}

export function ParadasComparadasWidget({ setorId = null }) {
  const { data, loading, error } = useParadasComparadas(setorId);

  if (loading) return <p className="text-sm text-muted-foreground">Carregando...</p>;
  if (error) return <p className="text-sm text-destructive">Erro ao carregar eventos.</p>;
  if (!data) return <p className="text-xs text-muted-foreground">Nenhum dado encontrado.</p>;
  if (Array.isArray(data) && data.length === 0)
    return <p className="text-xs text-muted-foreground">Nenhum registro disponível.</p>;

  return (
    <div className="flex flex-col w-full h-full">
      <div className="shrink-0">
        <p className="text-sm font-semibold text-foreground">
          Tempo Parado x Tempo Produzindo
        </p>
        <p className="text-[11px] text-muted-foreground font-medium mt-0.5">
          Atualizado em tempo real
        </p>
      </div>

      <div className="flex-1 min-h-0 mt-4">
        <DonutChart
          data={data}
          nameKey="name"
          dataKey="value"
          config={paradasComparadasConfig}
          valueFormatter={formatarMinutos}
          cy="54%"
        />
      </div>
    </div>
  );
}