"use client";
import { CustomPieChart } from "@/components/ui/charts/components/PieChart";
import { useMaquinaStatus } from "./hooks/useMaquinaStatus";
import { maquinaStatusConfig } from "./config/maquinaChartConfig";

export function MaquinaStatusDonutWidget({ setorId }) {
  const { data, loading, error } = useMaquinaStatus(setorId);

  if (loading) return <p className="text-xs text-muted-foreground">Carregando...</p>;
  if (error) return <p className="text-xs text-red-500">Erro ao carregar dados.</p>;
  if (!data) return <p className="text-xs text-muted-foreground">Nenhum dado encontrado.</p>;
  if (Array.isArray(data) && data.length === 0)
    return <p className="text-xs text-muted-foreground">Nenhum registro disponível.</p>;

  const chartData = data.map((item) => ({
    name: String(item.name || item.status || "desconhecido").toLowerCase(),
    value: Number(item.value ?? item.total) || 0,
  }));

  if (chartData.length === 0)
    return <p className="text-xs text-muted-foreground">Sem máquinas neste setor.</p>;

  return (
    <div className="flex flex-col w-full h-full">
      {/* Header próprio — não delega título ao CustomPieChart/DonutChart */}
      <div className="shrink-0">
        <p className="text-sm font-semibold text-foreground">
          Status Operacional das Máquinas
        </p>
        <p className="text-[11px] text-muted-foreground font-medium mt-0.5">
          Atualizado em tempo real
        </p>
      </div>

      {/* Gráfico preenche o restante do card */}
      <div className="flex-1 min-h-0 mt-4">
        <CustomPieChart
          data={chartData}
          config={maquinaStatusConfig}
          dataKey="value"
          showLegend
        />
      </div>
    </div>
  );
}
