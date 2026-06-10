"use client";
import { BarVerticalBase } from "@/components/ui/charts/components/BarVertical";
import { useVelocidadeMaquina } from "./hooks/useVelocidadeMaquina";
import { velocidadeConfig } from "./config/maquinaDetalheConfig";

export function VelocidadeMaquinaWidget({ maquinaId }) {
  const { data, loading, error } = useVelocidadeMaquina(maquinaId);

  if (loading) return <p className="text-sm text-muted-foreground">Carregando...</p>;
  if (error) return <p className="text-sm text-destructive">Erro ao carregar velocidade.</p>;
  if (!data) return <p className="text-xs text-muted-foreground">Nenhum dado encontrado.</p>;
  if (Array.isArray(data) && data.length === 0) return <p className="text-xs text-muted-foreground">Nenhum registro disponível.</p>;


  return (
    <div>
      <p className="text-sm font-semibold text-black">Velocidade Atual x Velocidade Padrão</p>
          <p className="text-[11px] text-muted-foreground font-medium mt-0.5">Atualizado em tempo real</p>
      <div className="mt-2">
        <BarVerticalBase
          data={data}
          config={velocidadeConfig}
          xKey="tipo"
          yKey="valor"
        />
      </div>
    </div>
  );
}