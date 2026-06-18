"use client";

import { BarHorizontal } from "@/components/ui/charts/components/BarHorizontal";
import { useRefugoPorSetor } from "./hooks/useRefugoPorSetor";
import { refugoSetorConfig } from "./config/setoresChartConfig";

export function RefugoPorSetorWidget() {
  const { data, loading, error } = useRefugoPorSetor();

  if (loading)
    return <p className="text-sm text-muted-foreground">Sincronizando...</p>;
  if (error)
    return <p className="text-sm text-destructive">Erro ao carregar refugo.</p>;
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
          Setores com mais produção de peças em refugo
        </p>
        <p className="text-[11px] text-muted-foreground font-medium mt-0.5">
          Atualizado em tempo real
        </p>
      </div>

      <div className="mb-6 mt-0 min-h-0 flex-1 flex flex-col justify-center">
        <div className="w-full flex justify-center flex-col">
          <BarHorizontal
            data={data}
            config={refugoSetorConfig}
            heightClassName="h-[280px]"
            paddingTopClassName="pt-14"
            yAxisWidth={170}
            yAxisTickFontSize={14}
            valueLabelFontSize={14}
            barSize={24}
            showValueLabels
          />
        </div>
      </div>
    </div>
  );
}
