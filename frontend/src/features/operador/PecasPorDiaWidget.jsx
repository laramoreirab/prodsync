"use client";

import { BarVerticalBase } from "@/components/ui/charts/components/BarVertical";
import { usePecasPorDia } from "./hooks/usePecasPorDia";


const pecasPorDiaConfig = {
  qtd: { 
    label: "Peças", 
    color: "#00357a" 
  },
};

export function PecasPorDiaWidget({ operadorId }) {
  const { data, loading, error } = usePecasPorDia(operadorId);

  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm">
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