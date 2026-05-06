"use client";
import { BarHorizontal } from "@/components/ui/charts/components/BarHorizontal";
import { useOEEMaquina } from "./hooks/useOEEMaquina";

const config = {
  oee: { label: "OEE", color: "#00357a" },
};

export function OEEMaquinaWidget({ operadorId }) {  // <- adiciona prop
  const { data, loading, error } = useOEEMaquina(operadorId); // <- passa o id

  if (loading) return <p className="text-sm text-muted-foreground">Carregando...</p>;
  if (error)   return <p className="text-sm text-destructive">Erro.</p>;
  if (!data || !data.length) return <p className="text-sm text-muted-foreground">Sem dados.</p>;

  return (
    <div>
      <p className="text-sm font-semibold text-black">OEE Médio da Máquina</p>
      <p className="text-xs text-gray-400 font-semibold mt-1">*Atualizado em tempo real</p>
      <BarHorizontal data={data} config={config} />
    </div>
  );
}