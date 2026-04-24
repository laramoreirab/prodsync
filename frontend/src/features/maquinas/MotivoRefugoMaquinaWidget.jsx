"use client";
import { CustomPieChart } from "@/components/ui/charts/components/PieChart";
import { useMotivoRefugoMaquina } from "./hooks/useMotivoRefugoMaquina";
import { motivoRefugoConfig } from "./config/maquinaDetalheConfig";
 
export function MotivoRefugoMaquinaWidget({ maquinaId }) {
  const { data, loading, error } = useMotivoRefugoMaquina(maquinaId);
 
  if (loading) return <p className="text-sm text-muted-foreground">Carregando...</p>;
  if (error)   return <p className="text-sm text-destructive">Erro ao carregar dados.</p>;
 
  return (
    <div>
      <p className="text-sm font-semibold text-black">Principais Motivos de Refugo</p>
      <p className="text-xs text-gray-400 font-semibold mt-1">*Atualizado em tempo real</p>
      <div className="mt-2">
        <CustomPieChart
          data={data}
          config={motivoRefugoConfig}
          dataKey="value"
          nameKey="name"
        />
      </div>
    </div>
  );
}
 