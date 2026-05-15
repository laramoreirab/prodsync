"use client";

import { BarVerticalBase } from "@/components/ui/charts/components/BarVertical";
import { usePecasPorDia } from "./hooks/usePecasPorDia";
import { pecasPorDiaConfig } from "@/features/operador/config/operadorConfig"

export function PecasPorDiaWidget({ operadorId }) {
  const { data, loading, error } = usePecasPorDia(operadorId);

  return (
    <div className="p-4 ">
      <p className="text-sm font-semibold text-black">
        Peças Produzidas
      </p>
      <p className="text-xs text-gray-400 font-semibold mt-1">
        *Atualizado em tempo real
      </p>

      <BarVerticalBase
        data={data}
        config={pecasPorDiaConfig}
        xKey="dia" 
        loading={loading}
        error={error}
      />
    </div>
  );
}