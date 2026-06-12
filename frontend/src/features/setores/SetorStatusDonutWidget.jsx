"use client";

import { CustomPieChart } from "@/components/ui/charts/components/PieChart";
import { useSetorMaquinaStatus } from "./hooks/useSetorMaquinaStatus";
import { setorStatusDonutConfig } from "./config/setoresChartConfig";

export function SetorStatusDonutWidget({ setorId }) {
  const { data, loading, error } = useSetorMaquinaStatus(setorId);

 if (loading) return <p className="text-sm text-muted-foreground">Carregando...</p>;
  if (error) return <p className="text-sm text-destructive">Erro ao carregar status.</p>;
   if (!data) return <p className="text-xs text-muted-foreground">Nenhum dado encontrado.</p>;
  if (Array.isArray(data) && data.length === 0) return <p className="text-xs text-muted-foreground">Nenhum registro disponível.</p>;

  const total = data.emProducao + data.emSetup + data.emParada;
  const values = [
    { name: "Produzindo", value: data.emProducao },
    { name: "Setup", value: data.emSetup },
    { name: "Paradas", value: data.emParada },
  ];

  const normalized = total > 0
    ? values.map((item, index) => {
        if (index === values.length - 1) {
          const computed = 100 - values.slice(0, -1).reduce((sum, next) => sum + Math.round((next.value / total) * 100), 0);
          return { ...item, value: computed };
        }

        return { ...item, value: Math.round((item.value / total) * 100) };
      })
    : values.map((item) => ({ ...item, value: 0 }));

 return (
    <div className="flex flex-col w-full h-full">
      {/* Header próprio — title não passado ao CustomPieChart */}
      <div className="shrink-0">
        <p className="text-sm font-semibold text-foreground">Status das Máquinas</p>
        <p className="text-[11px] text-muted-foreground font-medium mt-0.5">
          Atualizado em tempo real
        </p>
      </div>
 
      {/* Gráfico preenche o restante do card */}
      <div className="flex-1 min-h-0 mt-4">
        <CustomPieChart
          data={normalized}
          dataKey="value"
          config={setorStatusDonutConfig}
          showLabels
          compact={false}
          showLegend
        />
      </div>
    </div>
  );
}
 
