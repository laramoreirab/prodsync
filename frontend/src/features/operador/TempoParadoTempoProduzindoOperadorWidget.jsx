"use client";
import { EmptyChartState } from "@/components/ui/empty-chart-state";
import { useTempoParadoTempoProduzindoOperador } from "./hooks/useTempoParadoTempoProduzindoOperador";
import { BarVerticalBase } from "@/components/ui/charts/components/BarVertical";
import { tempoParadoTempoProduzindoOperadorConfig } from "@/features/operador/config/operadorConfig"

export function TempoParadoTempoProduzindoOperadorWidget({ operadorId }) {
  const { data, loading, error } = useTempoParadoTempoProduzindoOperador(operadorId);

  if (loading) return <p className="text-sm text-muted-foreground">Sincronizando...</p>;
  if (error) return <p className="text-sm text-destructive">Erro.</p>;
  if (!data) return <EmptyChartState title={"Tempo Total Parado x Tempo Produzindo"} message={"Nenhum dado encontrado."} />;
  if (Array.isArray(data) && data.length === 0) return <EmptyChartState title={"Tempo Total Parado x Tempo Produzindo"} message={"Nenhum registro de tempo disponível."} />;
 

  return (
    <div className="flex flex-col">
      <p className="text-sm font-semibold text-black">Tempo Total Parado x Tempo Produzindo</p>
          <p className="text-[11px] text-muted-foreground font-medium mt-0.5">Atualizado em tempo real</p>
      
      <BarVerticalBase
        data={data}
        config={tempoParadoTempoProduzindoOperadorConfig}
        loading={loading}
        error={error}
        xKey="dia"
        yKey="parada" 
      />
    </div>
  );
}