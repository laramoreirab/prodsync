"use client";
import { GaugeSemicircular } from "@/components/ui/charts/components/GaugeSemicircular";
import { useOPEficiencia } from "./hooks/useOPEficiencia";

const eficienciaConfig = {
  value: { label: "Eficiência", color: "#00357a" },
};

export function OPEficienciaWidget({ setorId = null }) {
  const { data, loading, error } = useOPEficiencia(setorId);

  if (loading)
    return <p className="text-sm text-muted-foreground">Sincronizando...</p>;
  if (error)
    return (
      <p className="text-sm text-destructive">Erro ao carregar eficiência.</p>
    );
  if (!data)
    return (
      <p className="text-xs text-muted-foreground">Nenhum dado encontrado.</p>
    );
  if (Array.isArray(data) && data.length === 0)
    return (
      <p className="text-xs text-muted-foreground">
        Nenhum registro disponível.
      </p>
    );

  return (
    <div className="flex h-full w-full flex-col">
      <div className="shrink-0">
        <p className="text-sm font-semibold text-black">
          Eficiência Geral das OPs
        </p>
        <p className="text-[11px] text-muted-foreground font-medium mt-0.5">
          Atualizado em tempo real
        </p>
      </div>
      <div className="min-h-0 flex-1 flex flex-col justify-center items-center w-full">
        <GaugeSemicircular
          title="Eficiência"
          data={[{ value: data?.eficiencia, fill: "#00357a" }]}
          size="xlg"
          config={eficienciaConfig}
        />
      </div>
    </div>
  );
}
