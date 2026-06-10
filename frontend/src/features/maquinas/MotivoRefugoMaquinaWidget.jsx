"use client";
import { CustomPieChart } from "@/components/ui/charts/components/PieChart";
import { useMotivoRefugoMaquina } from "./hooks/useMotivoRefugoMaquina";
import { motivoRefugoConfig } from "./config/maquinaDetalheConfig";
 
export function MotivoRefugoMaquinaWidget({ maquinaId }) {
  const { data, loading, error } = useMotivoRefugoMaquina(maquinaId);
 
  if (loading) return <p className="text-sm text-muted-foreground">Carregando...</p>;
  if (error)   return <p className="text-sm text-destructive">Erro ao carregar dados.</p>;
  if (!data) return <p className="text-xs text-muted-foreground">Nenhum dado encontrado.</p>;
  if (Array.isArray(data) && data.length === 0) return <p className="text-xs text-muted-foreground">Nenhum registro disponível.</p>;

 
  return (
    <div>
      <p className="text-sm font-semibold text-black">Principais Motivos de Refugo</p>
          <p className="text-[11px] text-muted-foreground font-medium mt-0.5">Atualizado em tempo real</p>
      <div className="mt-2">
        <CustomPieChart
          data={data}
          config={motivoRefugoConfig}
          dataKey="value"
          nameKey="name"
          showLegend
        />
      </div>
    </div>
  );
}
 
