"use client";
import { BarHorizontal } from "@/components/ui/charts/components/BarHorizontal";
import { useMotivoSetupMaquina } from "./hooks/useMotivoSetupMaquina";
import { motivoSetupConfig } from "./config/maquinaDetalheConfig";
 
export function MotivoSetupMaquinaWidget({ maquinaId }) {
  const { data, loading, error } = useMotivoSetupMaquina(maquinaId);
 
  if (loading) return <p className="text-sm text-muted-foreground">Sincronizando...</p>;
  if (error)   return <p className="text-sm text-destructive">Erro ao carregar dados.</p>;
  if (!data) return <p className="text-xs text-muted-foreground">Nenhum dado encontrado.</p>;
  if (Array.isArray(data) && data.length === 0) return <p className="text-xs text-muted-foreground">Nenhum registro disponível.</p>;

 
  // BarHorizontal espera a chave "setor" para o label do eixo Y
  const formattedData = data?.map(item => ({ ...item, setor: item.motivo }));
 
  return (
    <div>
      <p className="text-sm font-semibold text-black">Top 3 Motivos Frequentes de Setup</p>
          <p className="text-[11px] text-muted-foreground font-medium mt-0.5">Atualizado em tempo real</p>
      <div className="mt-2">
        <BarHorizontal
          data={formattedData}
          config={motivoSetupConfig}
        />
      </div>
    </div>
  );
}