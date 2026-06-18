"use client";

import { BarHorizontal } from "@/components/ui/charts/components/BarHorizontal";
import { useTopMotivosTempo } from "./hooks/useTopMotivosTempo";
import { topMotivosTempoConfig } from "./config/topMotivosTempoConfig";

export function TopMotivosTempoWidget({ setorId = null }) {
  const { data, loading, error } = useTopMotivosTempo(setorId);

  if (loading) return <p className="text-sm text-muted-foreground">Sincronizando...</p>;
  if (error) return <p className="text-sm text-destructive">Erro ao carregar motivos.</p>;
  if (!data) return <p className="text-xs text-muted-foreground">Nenhum dado encontrado.</p>;
  if (Array.isArray(data) && data.length === 0) {
    return <p className="text-xs text-muted-foreground">Nenhum registro disponivel.</p>;
  }

  const formattedData = data
    .slice(0, 3)
    .map((item) => ({ ...item, setor: item.motivo }));

  return (
<div className="flex h-full w-full flex-col">
      <div className="shrink-0">
        <p className="text-sm font-semibold text-black">
          Top 3 Motivos de Parada (Tempo)
        </p>
        <p className="text-[11px] text-muted-foreground font-medium mt-0.5">Atualizado em tempo real</p>

      </div>

<div className="min-h-0 flex-1 flex flex-col justify-center items-center w-full">
        <div className="w-full flex justify-center flex-col">
        <BarHorizontal
          data={formattedData}
          config={topMotivosTempoConfig}
          yAxisWidth={130}
          heightClassName="h-[230px]"
          paddingTopClassName="pt-4"
          barSize={42}
        />
        </div>
      </div>
    </div>
  );
}
