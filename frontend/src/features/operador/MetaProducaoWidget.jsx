"use client";

import { useMetaProducao } from "./hooks/useMetaProducao";
import { CustomPieChart } from "@/components/ui/charts/components/PieChart";

const metaConfig = {
  completo: { label: "Completo", color: "#00357a" },
  restante: { label: "Restante", color: "#e2e8f0" },
};

export function MetaProducaoWidget({ operadorId }) {
  const { data, loading, error } = useMetaProducao(operadorId);

  if (loading) return <p className="text-sm text-muted-foreground">Carregando...</p>;
  if (error)   return <p className="text-sm text-destructive">Erro ao carregar meta.</p>;

  const chartData = [
    { name: "completo", value: data.completo },
    { name: "restante", value: data.restante },
  ];

  return (
    <div className="flex flex-col gap-2">
      <div className="text-left">
        <p className="text-sm font-semibold text-black">Meta da Produção</p>
        <p className="text-xs text-gray-400 font-semibold">*Atualizado em tempo real</p>
      </div>
      {/* Container central do gráfico */}
      <div className="flex flex-col items-center">
        <CustomPieChart data={chartData} config={metaConfig}>
          <div className="flex flex-col items-center pb-4">
            <span className="text-3xl font-bold text-black">{data.completo}%</span>
            <span className="text-xs text-gray-400 font-semibold">Completo</span>
          </div>
        </CustomPieChart>

        {/* Legenda das cores */}
        <div className="flex gap-4 mt-2">
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