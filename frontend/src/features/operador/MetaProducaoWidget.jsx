"use client";

import { useMetaProducao } from "./hooks/useMetaProducao";
import { CustomPieChart } from "@/components/ui/charts/components/PieChart";
import { metaConfig } from "@/features/operador/config/operadorConfig"


export function MetaProducaoWidget({ operadorId }) {
  const { data, loading, error } = useMetaProducao(operadorId);

  if (loading) return <p className="text-sm text-muted-foreground">Carregando...</p>;
  if (error) return <p className="text-sm text-destructive">Erro ao carregar meta.</p>;
  if (!data) return <p className="text-xs text-muted-foreground">Nenhum dado encontrado.</p>;
  if (Array.isArray(data) && data.length === 0) return <p className="text-xs text-muted-foreground">Nenhum registro disponível.</p>;


  const chartData = [
    { name: "completo", value: data.completo },
    { name: "restante", value: data.restante },
  ];

  return (
    <div className="flex flex-col gap-2 w-full h-full px-4 justify-between">
      <div className="text-left">
        <p className="text-sm font-semibold text-black">Meta da Produção</p>
          <p className="text-[11px] text-muted-foreground font-medium mt-0.5">Atualizado em tempo real</p>
      </div>
      {/* Container central do gráfico */}
      <div className="flex flex-col items-center">
        <CustomPieChart data={chartData} config={metaConfig} showOuterLabels>
          <div className="flex flex-col items-center pb-4">
            <span className="text-3xl font-bold text-black">{data.completo}%</span>
            <span className="text-xs text-gray-400 font-semibold">Completo</span>
          </div>
        </CustomPieChart>
      </div>
    </div>
  );
}
