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
  if (Array.isArray(data) && data.length === 0) {
    return <p className="text-xs text-muted-foreground">Nenhum registro disponivel.</p>;
  }

  return (
    <div>
      <p className="text-sm font-semibold text-black">
        Tempo Parado x Tempo Produzindo
      </p>
      <p className="text-xs text-gray-400 font-semibold mt-1">
        *Dados desta semana
      </p>

      <div className="mt-8">
        <DonutChart
          data={data}
          nameKey="name"
          dataKey="value"
          config={paradasComparadasConfig}
          valueFormatter={formatarMinutos}
          chartClassName="h-[220px] w-full"
          cy="54%"
        />
      </div>
    </div>
  );
}
