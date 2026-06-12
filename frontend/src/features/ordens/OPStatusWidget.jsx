"use client";

import { CustomPieChart } from "@/components/ui/charts/components/PieChart";
import { useOPStatus } from "./hooks/useOPStatus";

const opStatusConfig = {
  "Em Produção": {
    label: "Em Produção",
    color: "var(--chart1)",
  },
  "Pausadas (Setup)": {
    label: "Pausadas (Setup)",
    color: "var(--chart2)",
  },
  "Pausadas": {
    label: "Pausadas",
    color: "var(--chart3)",
  },
  "Aguardando Início": {
    label: "Aguardando Início",
    color: "var(--chart4)",
  },
  "Concluída": {
    label: "Concluída",
    color: "var(--chart5)",
  },
};

const opStatusChartConfig = {
  ...opStatusConfig,
  Finalizada: {
    label: "Finalizadas",
    color: "#1d4ed8",
  },
  Finalizadas: {
    label: "Finalizadas",
    color: "#1d4ed8",
  },
  "Concluída": {
    label: "Finalizadas",
    color: "#1d4ed8",
  },
  "Concluídas": {
    label: "Finalizadas",
    color: "#1d4ed8",
  },
};

export function OPStatusWidget({ setorId = null }) {
  const { data, loading, error } = useOPStatus(setorId);

  if (loading) return <p className="text-sm text-muted-foreground p-4">Sincronizando...</p>;
  if (error) return <p className="text-sm text-destructive p-4">Erro ao carregar status.</p>;
  if (!data) return <p className="text-xs text-muted-foreground p-4">Nenhum dado encontrado.</p>;
  if (Array.isArray(data) && data.length === 0) return <p className="text-xs text-muted-foreground p-4">Nenhum registro disponível.</p>;

  const chartData = Array.isArray(data)
    ? data.map((item) => {
        const statusKey = item.status || item.name;
        const configDoStatus = opStatusChartConfig[statusKey];

        return {
          ...item,
          status: statusKey,
          name: statusKey,
          fill: configDoStatus?.color || "var(--chart-1)",
        };
      })
    : [];

  return (
    <div className="flex flex-col gap-6 w-full p-4 h-full justify-between">
      {/* Cabeçalho Padronizado */}
      <div className="text-left w-full">
        <h2 className="text-sm font-semibold tracking-tight text-foreground">
          Status das OPs
        </h2>
        <p className="text-[10px] text-muted-foreground">Atualizando em tempo real</p>
      </div>

      <div className="flex items-center justify-center flex-1 w-full min-h-[200px]">
        <CustomPieChart
          data={chartData}
          config={opStatusChartConfig}
          dataKey="value"
          nameKey="status" 
          showLegend
          outerLabelLayout="fixed-elbows"
        />
      </div>
    </div>
  );
}
