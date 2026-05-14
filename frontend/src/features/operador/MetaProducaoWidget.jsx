"use client";

import { useMetaProducao } from "./hooks/useMetaProducao";
import { CustomPieChart } from "@/components/ui/charts/components/PieChart";
import { metaConfig } from "@/features/operador/config/operadorConfig"


export function MetaProducaoWidget({ operadorId }) {
  const { data, loading, error } = useMetaProducao(operadorId);

  if (loading) return <p className="text-xs text-muted-foreground">Carregando...</p>;
if (error)   return <p className="text-xs text-red-500">Erro ao carregar dados.</p>;
if (!data)   return <p className="text-xs text-muted-foreground">Nenhum dado encontrado.</p>;
if (Array.isArray(data) && data.length === 0) return <p className="text-xs text-muted-foreground">Nenhum registro disponível.</p>;

  const chartData = [
    { name: "completo", value: data.completo },
    { name: "restante", value: data.restante },
  ];

  return (
    <div className="h-full w-full min-h-0 flex flex-col">
      <header>
        <p className="text-sm font-semibold text-black">Meta da Produção</p>
        <p className="text-xs text-gray-400 font-semibold mt-1">*Atualizado em tempo real</p>
      </header>
      {/* Container central do gráfico */}
      <div className="mt-2 flex min-h-0 flex-1 flex-col items-center justify-center">
        <CustomPieChart
          data={chartData}
          config={metaConfig}
          chartClassName="h-[220px] w-full sm:h-[260px] md:h-[300px]"
          showLabels={false}
        >
          <div className="flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-black text-center">{data.completo}%</span>
            <span className="text-xs text-gray-400 font-semibold text-center">Completo</span>
          </div>
        </CustomPieChart>

        {/* Legenda das cores */}
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-2">
          {Object.entries(metaConfig).map(([key, item]) => (
            <div key={key} className="flex items-center gap-1.5">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: item.color }}
              />
              <span className="text-xs font-medium text-gray-600">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
