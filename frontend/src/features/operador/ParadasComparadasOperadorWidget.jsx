"use client";

import { useParadasOperador } from "./hooks/useParadasOperador";
import { BarVerticalBase } from "@/components/ui/charts/components/BarVertical";
import { paradasConfig } from "@/features/operador/config/operadorConfig"

export function ParadasComparadasOperadorWidget({ operadorId }) {
  const { data, loading, error } = useParadasOperador(operadorId);

  return (
    <div className="flex flex-col">
      <p className="text-sm font-semibold text-black">Paradas Registradas x Paradas Reais</p>
      <p className="text-xs text-gray-400 font-semibold mt-1">*Atualizado em tempo real</p>
      
      <BarVerticalBase
        data={data}
        config={paradasConfig}
        loading={loading}
        error={error}
        xKey="dia"
        yKey="reais" 
      />
    </div>
  );
}