"use client";

import { GaugeSemicircular } from "@/components/ui/charts/components/GaugeSemicircular";
import { useOEECritico } from "./hooks/useOEECritico";
import { oeeSetorConfig } from "./config/setoresChartConfig";

export function OEECriticoWidget() {
  const { data, loading, error } = useOEECritico();

  if (loading) return <p className="text-sm text-muted-foreground">Carregando...</p>;
  if (error) return <p className="text-sm text-destructive">Erro ao carregar OEE crítico.</p>;
   if (!data) return <p className="text-xs text-muted-foreground">Nenhum dado encontrado.</p>;
  if (Array.isArray(data) && data.length === 0) return <p className="text-xs text-muted-foreground">Nenhum registro disponível.</p>;


  return (
    <div className=" flex flex-col gap-2">
      <div>
        <h2 className="text-sm font-semibold text-black">Setor com OEE mais crítico</h2>
          <p className="text-[11px] text-muted-foreground font-medium mt-0.5">Atualizado em tempo real</p>

      </div>

      <div className="flex items-center justify-center py-4">
        <div className="flex flex-col items-center">
          <GaugeSemicircular
            title={data.setor}
            data={[{ value: data.oee, fill: "var(--color-grafico-area)" }]}
            size="xlg"
            config={{
              value: { label: data.setor },
            }}
          />

        </div>
      </div>
    </div>
  );
}