"use client";

import { AreaChartBase } from "@/components/ui/charts/components/AreaChart"; // Certifique-se de que o caminho está correto
import { useSetorOEEEvolucao } from "./hooks/useSetorOEEEvolucao";
import { setorOEEEvolucaoConfig } from "./config/setoresChartConfig";

export function SetorOEEEvolucaoWidget({ setorId }) {
  const { data, loading, error } = useSetorOEEEvolucao(setorId);

  if (loading) return <p className="text-sm text-muted-foreground">Carregando...</p>;
  if (error) return <p className="text-sm text-destructive">Erro ao carregar status.</p>;
   if (!data) return <p className="text-xs text-muted-foreground">Nenhum dado encontrado.</p>;
  if (Array.isArray(data) && data.length === 0) return <p className="text-xs text-muted-foreground">Nenhum registro disponível.</p>;

  return (
    <div>
      <p className="text-sm font-semibold text-black">Evolução do OEE</p>
          <p className="text-[11px] text-muted-foreground font-medium mt-0.5">Atualizado em tempo real</p>


      <div className="mt-2">
        <AreaChartBase
          data={data}
          xKey="dia"
          yKey="oee" 
          config={setorOEEEvolucaoConfig}
          size="pequeno"
        />
      </div>
    </div>
  );
}