"use client";

import { BarHorizontal } from "@/components/ui/charts/components/BarHorizontal";
import { useSetorProducaoMaquina } from "./hooks/useSetorProducaoMaquina";
import { setorProducaoMaquinaConfig } from "./config/setoresChartConfig";

export function SetorProducaoMaquinaWidget({ setorId }) {
  const { data, loading, error } = useSetorProducaoMaquina(setorId);

   if (loading) return <p className="text-xs text-muted-foreground">Carregando...</p>;
 if (error)   return <p className="text-xs text-red-500">Erro ao carregar dados.</p>;
 if (!data)   return <p className="text-xs text-muted-foreground">Nenhum dado encontrado.</p>;
 if (Array.isArray(data) && data.length === 0) return <p className="text-xs text-muted-foreground">Nenhum registro disponível.</p>;
 
  return (
    <div>
      <p className="text-sm font-semibold text-black">Produção das Máquinas do Setor</p>
      <p className="text-xs text-gray-400 font-semibold mt-1">*Atualizado em tempo real</p>
      <div className="mt-2">
        <BarHorizontal
          data={data}
          config={setorProducaoMaquinaConfig}
        />
      </div>
    </div>
  );
}