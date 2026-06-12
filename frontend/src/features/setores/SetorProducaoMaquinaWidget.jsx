"use client";

import { BarHorizontal } from "@/components/ui/charts/components/BarHorizontal";
import { useSetorProducaoMaquina } from "./hooks/useSetorProducaoMaquina";
import { setorProducaoMaquinaConfig } from "./config/setoresChartConfig";

export function SetorProducaoMaquinaWidget({ setorId }) {
  const { data, loading, error } = useSetorProducaoMaquina(setorId);

 if (loading) return <p className="text-sm text-muted-foreground">Sincronizando...</p>;
  if (error) return <p className="text-sm text-destructive">Erro ao carregar status.</p>;
   if (!data) return <p className="text-xs text-muted-foreground">Nenhum dado encontrado.</p>;
  if (Array.isArray(data) && data.length === 0) return <p className="text-xs text-muted-foreground">Nenhum registro disponível.</p>;

  return (
    <div>
      <p className="text-sm font-semibold text-black">Produção das Máquinas do Setor</p>
          <p className="text-[11px] text-muted-foreground font-medium mt-0.5">Atualizado em tempo real</p>
      <div className="mt-2">
        <BarHorizontal
          data={data}
          config={setorProducaoMaquinaConfig}
        />
      </div>
    </div>
  );
}