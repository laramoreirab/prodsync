"use client";
import { BarHorizontal } from "@/components/ui/charts/components/BarHorizontal";
import { useOEEMaquina } from "./hooks/useOEEMaquina";

const config = {
  oee: { label: "OEE", color: "var(--chart-primary)" },
};

export function OEEMaquinaWidget({ operadorId }) {  // <- adiciona prop
  const { data, loading, error } = useOEEMaquina(operadorId); // <- passa o id

  if (loading) return <p className="text-xs text-muted-foreground">Carregando...</p>;
  if (error)   return <p className="text-xs text-red-500">Erro ao carregar dados.</p>;
  if (!data)   return <p className="text-xs text-muted-foreground">Nenhum dado encontrado.</p>;
  if (Array.isArray(data) && data.length === 0) return <p className="text-xs text-muted-foreground">Nenhum registro disponível.</p>;
  return (
    <div>
      <p className="text-sm font-semibold text-black">OEE Médio da Máquina</p>
      <p className="text-xs text-gray-400 font-semibold mt-1">*Atualizado em tempo real</p>
      <BarHorizontal data={data} config={config} />
    </div>
  );
}