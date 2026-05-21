"use client";

import { DonutChart } from "@/components/ui/charts/components/DonutChart";
import { useParadasComparadas } from "./hooks/useParadasComparadas";
import { paradasComparadasConfig } from "./config/paradasComparadasConfig";

export function ParadasComparadasWidget({ setorId = null }) {
  const { data: response, loading, error } = useParadasComparadas(setorId);

  const listaDados = response?.dados || [];

  if (loading) return <p className="text-sm text-muted-foreground">Carregando...</p>;
  if (error)   return <p className="text-sm text-destructive">Erro ao carregar eventos.</p>;
  if (!response) return <p className="text-xs text-muted-foreground">Nenhum dado encontrado.</p>;
  if (listaDados.length === 0) return <p className="text-xs text-muted-foreground">Nenhum registro disponível.</p>;

  return (
    <div>
      <p className="text-sm font-semibold text-black">
        Tempo Parado x Tempo Produzindo
      </p>
      <p className="text-xs text-gray-400 font-semibold mt-1">
        *Atualizado em tempo real
      </p>

      <div className="mt-2">
        <DonutChart
          data={listaDados}
          nameKey="nome"   
          dataKey="valor"
          config={paradasComparadasConfig}
        />
      </div>
    </div>
  );
}