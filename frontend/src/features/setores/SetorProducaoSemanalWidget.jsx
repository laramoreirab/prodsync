"use client";

import { AreaChartBase } from "@/components/ui/charts/components/AreaChart"; // Certifique-se de que o caminho está correto
import { useSetorProducaoSemanal } from "./hooks/useSetorProducaoSemanal";
import { setorProducaoSemanalConfig } from "./config/setoresChartConfig";

export function SetorProducaoSemanalWidget({ setorId }) {
  const { data, loading, error } = useSetorProducaoSemanal(setorId);

    if (loading) return <p className="text-xs text-muted-foreground">Carregando...</p>;
  if (error)   return <p className="text-xs text-red-500">Erro ao carregar dados.</p>;
  if (!data)   return <p className="text-xs text-muted-foreground">Nenhum dado encontrado.</p>;
  if (Array.isArray(data) && data.length === 0) return <p className="text-xs text-muted-foreground">Nenhum registro disponível.</p>;
  
  return (
    <div>
      <p className="text-sm font-semibold text-black">Produção Semanal</p>
      <p className="text-xs text-gray-400 font-semibold mt-1">
        *Atualizado em tempo real
      </p>

      <div className="mt-2">
        <AreaChartBase
          data={data}
          xKey="dia"
          yKey="qtd" 
          config={setorProducaoSemanalConfig}
        />
      </div>
    </div>
  );
}