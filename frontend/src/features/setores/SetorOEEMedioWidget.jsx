"use client";

import { GaugeSemicircular } from "@/components/ui/charts/components/GaugeSemicircular";
import { useSetorOEEMedio } from "./hooks/useSetorOEEMedio";

const oeeConfig = {
  value: { label: "OEE", color: "#00357a" },
};

export function SetorOEEMedioWidget({ setorId }) {
  const { data, loading, error } = useSetorOEEMedio(setorId);

  if (loading) return <p className="text-sm text-muted-foreground">Carregando...</p>;
  if (error) return <p className="text-sm text-destructive">Erro ao carregar OEE.</p>;
  if (!data) return null;

  return (
    <div className="flex flex-col gap-2">
      <div>
        <p className="text-sm font-semibold text-black">OEE médio do Setor</p>
        <p className="text-xs text-gray-400 font-semibold mt-1">*Atualizado em tempo real</p>
      </div>

      <div className="flex items-center justify-center py-2">
        <GaugeSemicircular
          title={data.setor}
          data={[{ value: data.oee, fill: "#00357a" }]}
          size="lg"
          config={oeeConfig}
        />
      </div>
    </div>
  );
}