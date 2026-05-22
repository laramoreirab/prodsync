"use client";
import { useTempoParadoTempoProduzindoOperador } from "./hooks/useTempoParadoTempoProduzindoOperador";
import { BarVerticalBase } from "@/components/ui/charts/components/BarVertical";
import { tempoParadoTempoProduzindoOperadorConfig } from "@/features/operador/config/operadorConfig"

export function TempoParadoTempoProduzindoOperadorWidget({ operadorId }) {
  const { data, loading, error } = useTempoParadoTempoProduzindoOperador(operadorId);

  if (loading) return <p className="text-sm text-muted-foreground">Carregando...</p>;
  if (error) return <p className="text-sm text-destructive">Erro.</p>;
  if (!data) return <p className="text-xs text-muted-foreground">Nenhum dado encontrado.</p>;
  if (Array.isArray(data) && data.length === 0) return <p className="text-xs text-muted-foreground">Nenhum registro disponível.</p>;
 

  return (
    <div className="flex flex-col">
      <p className="text-sm font-semibold text-black">Tempo Total Parado x Tempo Produzindo</p>
      <p className="text-xs text-gray-400 font-semibold mt-1">*Atualizado em tempo real</p>
      
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