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
    <div>
      <p className="text-sm font-semibold text-black">Status das Máquinas</p>
      <p className="text-xs text-gray-400 font-semibold mt-1">*Atualizado em tempo real</p>
      <div className="mt-4">
        <CustomPieChart
          title="Status das Máquinas"
          data={normalized}
          dataKey="value"
          config={setorStatusDonutConfig}
          showLabels
          compact={false}
        />
      </div>
    </div>
  );
}