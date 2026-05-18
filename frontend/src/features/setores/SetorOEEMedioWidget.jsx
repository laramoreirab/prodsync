"use client";

import { GaugeSemicircular } from "@/components/ui/charts/components/GaugeSemicircular";
import { useSetorOEEPanel } from "./hooks/useSetorOEEPanel";

const oeeMetrics = [
  { key: "disponibilidade", label: "Disponibilidade", color: "var(--chart-primary)" },
  { key: "performance", label: "Performance", color: "var(--chart-secondary)" },
  { key: "qualidade", label: "Qualidade", color: "var(--chart-accent)" },
];

export function SetorOEEMedioWidget({ setorId }) {
  const { data, loading, error } = useSetorOEEPanel(setorId);

  if (loading) return <p className="text-xs text-muted-foreground">Carregando...</p>;
  if (error) return <p className="text-xs text-red-500">Erro ao carregar dados.</p>;
  if (!data) return <p className="text-xs text-muted-foreground">Nenhum dado encontrado.</p>;

  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="text-sm font-semibold text-black">Resumo OEE geral do Setor</p>
        <p className="text-xs text-gray-400 font-semibold mt-1">*Atualizado em tempo real</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {oeeMetrics.map(({ key, label, color }) => (
          <div key={key} className="flex flex-col items-center gap-2 rounded-2xl bg-slate-50 p-3">
            <GaugeSemicircular
              title={label}
              data={[{ value: data[key], fill: color }]}
              size="default"
              config={{ value: { label, color } }}
            />
          </div>
        ))}
      </div>

      <div className="flex justify-center py-4">
        <GaugeSemicircular
          title="OEE Geral Consolidado"
          data={[{ value: data.oee, fill: "var(--chart-deep)" }]}
          size="lg"
          config={{ value: { label: "OEE Geral", color: "var(--chart-deep)" } }}
        />
      </div>
    </div>
  );
}