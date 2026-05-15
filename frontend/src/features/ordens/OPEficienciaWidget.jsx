"use client";
import { GaugeSemicircular } from "@/components/ui/charts/components/GaugeSemicircular";
import { useOPEficiencia } from "./hooks/useOPEficiencia";

const eficienciaConfig = {
  value: { label: "Eficiência", color: "#00357a" },
};

export function OPEficienciaWidget() {
  const { data, loading, error } = useOPEficiencia();

  if (loading) return <p className="text-sm text-muted-foreground">Carregando...</p>;
  if (error)   return <p className="text-sm text-destructive">Erro ao carregar eficiência.</p>;

  return (
    <div className="flex flex-col h-full">
      <p className="text-sm font-semibold text-black">Eficiências Geral das OPs</p>
      <p className="text-xs text-gray-400 font-semibold mt-1">*Atualizado em tempo real</p>
      <div className="flex-1 flex items-center justify-center">
        <GaugeSemicircular
          title="Eficiência"
          data={[{ value: data?.eficiencia, fill: "#00357a" }]}
          size="lg"
          config={eficienciaConfig}
        />
      </div>
    </div>
  );
}