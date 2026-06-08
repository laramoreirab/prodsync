"use client";

import { AreaChartBase } from "@/components/ui/charts/components/AreaChart";
import { useSetorProducaoDiaria } from "./hooks/useSetorProducaoDiaria";
import { setorProducaoDiariaConfig } from "./config/setoresChartConfig";

export function SetorProducaoDiariaWidget({ setorId }) {
  const { data, loading, error } = useSetorProducaoDiaria(setorId);

  if (loading) return <p className="text-xs text-muted-foreground">Carregando...</p>;
  if (error) return <p className="text-xs text-red-500">Erro ao carregar dados.</p>;
  if (!data) return <p className="text-xs text-muted-foreground">Nenhum dado encontrado.</p>;
  if (Array.isArray(data) && data.length === 0) return <p className="text-xs text-muted-foreground">Nenhum registro disponível.</p>;

  return (
    <div>
      <p className="text-sm font-semibold text-black">Produção ao Longo do Dia no Setor</p>
          <p className="text-[11px] text-muted-foreground font-medium mt-0.5">Atualizado em tempo real</p>

      <div className="mt-4">
        <AreaChartBase
          data={data}
          xKey="hora"
          yKey="pcs"
          config={setorProducaoDiariaConfig}
        />
      </div>
    </div>
  );
}