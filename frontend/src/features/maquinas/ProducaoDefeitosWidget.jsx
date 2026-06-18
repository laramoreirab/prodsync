"use client";

import { BarStackedHorizontal } from "@/components/ui/charts/components/BarStackedHorizontal";
import { useProducaoDefeitos } from "./hooks/useProducaoDefeitos";
import { producaoDefeitosConfig } from "./config/maquinaChartConfig";

export function ProducaoDefeitosWidget({ setorId }) {
  const { data, loading, error } = useProducaoDefeitos(setorId);

  if (loading)
    return <p className="text-sm text-muted-foreground">Sincronizando...</p>;
  if (error)
    return <p className="text-sm text-destructive">Erro ao carregar dados.</p>;
  if (!data)
    return (
      <p className="text-xs text-muted-foreground">Nenhum dado encontrado.</p>
    );
  if (Array.isArray(data) && data.length === 0)
    return (
      <p className="text-xs text-muted-foreground">
        Nenhum registro disponível.
      </p>
    );

  return (
    <div className="flex h-full w-full flex-col">
      <div className="shrink-0">
        <p className="text-sm font-semibold text-black">
          Produção de peças com defeitos
        </p>
        <p className="text-[11px] text-muted-foreground font-medium mt-0.5">
          Atualizado em tempo real
        </p>
      </div>

      <div className="mt-4 min-h-0 flex-1 flex flex-col justify-center">
        <BarStackedHorizontal
          data={data}
          config={producaoDefeitosConfig}
          xKey="maquina"
          limit={5}
          heightClassName="h-[330px]"
          yAxisWidth={185}
          barSize={24}
        />
      </div>
    </div>
  );
}
