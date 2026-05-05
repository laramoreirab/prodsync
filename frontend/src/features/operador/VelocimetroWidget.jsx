"use client";
import { GaugeSemicircular } from "@/components/ui/charts/components/GaugeSemicircular";
import { useVelocimetro } from "./hooks/useVelocimetro";

export function VelocimetroWidget({ operadorId }) {
  const { data, loading, error } = useVelocimetro(operadorId);
  if (loading) return <p className="text-sm text-muted-foreground">Carregando...</p>;
  if (error)   return <p className="text-sm text-destructive">Erro.</p>;

  const pct = Math.round((data.atual / data.ideal) * 100);

  return (
    <div className="flex flex-col items-center gap-2">
      <p className="text-sm font-semibold text-black self-start">Velocímetro</p>
      <p className="text-xs text-gray-400 font-semibold mt-1 self-start">*Atualizado em tempo real</p>
      <GaugeSemicircular
        data={[{ value: pct, fill: "#00357a" }]}
        size="lg"
        config={{ value: { label: `${data.atual} peças por hora` } }}
      />
      <p className="text-xs text-gray-400">Ideal: {data.ideal} peças por hora</p>
    </div>
  );
}