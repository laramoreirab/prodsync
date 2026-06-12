"use client";
 
import { BarVerticalBase } from "@/components/ui/charts/components/BarVertical";
import { useSetorTopOperadores } from "./hooks/useSetorTopOperadores";
import { setorTopOperadoresConfig } from "./config/setoresChartConfig";
 
export function SetorTopOperadoresWidget({ setorId }) {
  const { data, loading, error } = useSetorTopOperadores(setorId);
   if (loading) return <p className="text-sm text-muted-foreground">Sincronizando...</p>;
  if (error) return <p className="text-sm text-destructive">Erro ao carregar status.</p>;
   if (!data) return <p className="text-xs text-muted-foreground">Nenhum dado encontrado.</p>;
  if (Array.isArray(data) && data.length === 0) return <p className="text-xs text-muted-foreground">Nenhum registro disponível.</p>;

 
  return (
    <div>
      <p className="text-sm font-semibold text-black">
        Top 5 operadores com maior número de peças produzidas
      </p>
          <p className="text-[11px] text-muted-foreground font-medium mt-0.5">Atualizado em tempo real</p>
 
      <div className="mt-2">
        <BarVerticalBase
          data={data}
          xKey="operador"
          config={setorTopOperadoresConfig}
          loading={loading}
          error={error}
        />
      </div>
    </div>
  );
}