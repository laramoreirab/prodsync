"use client";
import { BarHorizontal } from "@/components/ui/charts/components/BarHorizontal";
import { useOEEMaquina } from "./hooks/useOEEMaquina";

const config = {
  oee: { label: "OEE", color: "#00357a" },
};

export function OEEMaquinaWidget({ operadorId }) {  // <- adiciona prop
  const { data, loading, error } = useOEEMaquina(operadorId); // <- passa o id

  if (loading) return <p className="text-sm text-muted-foreground">Carregando...</p>;
  if (error) return <p className="text-sm text-destructive">Erro.</p>;
  if (!data) return <p className="text-xs text-muted-foreground">Nenhum dado encontrado.</p>;
  if (Array.isArray(data) && data.length === 0) return <p className="text-xs text-muted-foreground">Nenhum registro disponível.</p>;

  return (
    <div>
      <p className="text-sm font-semibold text-black">OEE Médio da Máquina</p>
          <p className="text-[11px] text-muted-foreground font-medium mt-0.5">Atualizado em tempo real</p>
      <BarHorizontal data={data} config={config} />
    </div>
  );
}