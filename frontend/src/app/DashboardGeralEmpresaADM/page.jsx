"use client";


import { LineChartBase } from "@/components/ui/charts/Ex1_LineChart";
import { useProducaoDia } from "@/hooks/useProducaoDia";
import { producaoDiaConfig } from "@/components/ui/config/producaoDiaConfig";

export default function TestePage() {
  const data = useProducaoDia();

  return (
    <main className="p-8">
      <LineChartBase
        title="Produção ao Longo do Dia"
        description="Atualizado em tempo real"
        data={data}
        xKey="hora"
        yKey="pcs"
        config={producaoDiaConfig}
      />
    </main>
  );
}