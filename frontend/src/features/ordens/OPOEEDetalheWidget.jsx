"use client";

import { useOPOEEDetalhe } from "./hooks/useOPOEEDetalhe";
import { GaugeSemicircular } from "@/components/ui/charts/components/GaugeSemicircular";

const metricas = [
  { key: "disponibilidade", label: "Disponibilidade",      color: "#00357a" },
  { key: "performance",     label: "Performance",          color: "#00357a" },
  { key: "qualidade",       label: "Qualidade",            color: "#00357a" },
  { key: "oee",             label: "OEE Geral Consolidado", color: "#00357a" },
];

export function OPOEEDetalheWidget({ opId }) {
  const { data, loading, error } = useOPOEEDetalhe(opId);

  if (loading) return <p className="text-sm text-muted-foreground">Carregando OEE...</p>;
  if (error)   return <p className="text-sm text-destructive">Erro ao carregar OEE.</p>;
  if (!data)   return null;

  return (
    <div className="flex flex-col gap-2">
      <div>
        <h2 className="text-sm font-semibold text-black">Resumo OEE geral da Máquina durante a OP</h2>
        <p className="text-xs text-gray-400 font-semibold mt-1">*Atualizado em tempo real</p>
      </div>

      <div className="flex items-end justify-around gap-4 flex-wrap py-4">
        {metricas.map(({ key, label, color }) => (
          <div key={key} className="flex flex-col items-center">
            <GaugeSemicircular
              title={label}
              data={[{ value: data[key], fill: color }]}
              size={key === "oee" ? "lg" : "default"}
              config={{ value: { label, color } }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}