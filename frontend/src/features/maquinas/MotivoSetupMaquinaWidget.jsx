"use client";
import { BarHorizontal } from "@/components/ui/charts/components/BarHorizontal";
import { useMotivoSetupMaquina } from "./hooks/useMotivoSetupMaquina";
import { motivoSetupConfig } from "./config/maquinaDetalheConfig";
 
export function MotivoSetupMaquinaWidget({ maquinaId }) {
  const { data, loading, error } = useMotivoSetupMaquina(maquinaId);
 
  if (loading) return <p className="text-sm text-muted-foreground">Carregando...</p>;
  if (error)   return <p className="text-sm text-destructive">Erro ao carregar dados.</p>;
 
  // BarHorizontal espera a chave "setor" para o label do eixo Y
  const formattedData = data?.map(item => ({ ...item, setor: item.motivo }));
 
  return (
    <div>
      <p className="text-sm font-semibold text-black">Top 3 Motivos Frequentes de Setup</p>
      <p className="text-xs text-gray-400 font-semibold mt-1">*Atualizado em tempo real</p>
      <div className="mt-2">
        <BarHorizontal
          data={formattedData}
          config={motivoSetupConfig}
        />
      </div>
    </div>
  );
}