"use client";
import { useTempoParadoTempoProduzindoOperador } from "./hooks/useTempoParadoTempoProduzindoOperador";
import { BarVerticalBase } from "@/components/ui/charts/components/BarVertical";
import { tempoParadoTempoProduzindoOperadorConfig } from "@/features/operador/config/operadorConfig"

export function TempoParadoTempoProduzindoOperadorWidget({ operadorId }) {
  const { data, loading, error } = useTempoParadoTempoProduzindoOperador(operadorId);

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
        yKey="paradas" 
      />
    </div>
  );
}