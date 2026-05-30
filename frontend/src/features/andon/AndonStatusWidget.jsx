"use client";

import { KPI } from "@/components/ui/charts/components";
import { useAndonStatus } from "./hooks/useAndonStatus";

const cards = [
  {
    key: "emProducao",
    label: "Em Produção",
    accent: "#369948",
  },
  {
    key: "emSetup",
    label: "Em Setup",
    accent: "#ffac1e",
  },
  {
    key: "emParada",
    label: "Em Parada",
    accent: "var(--trash)",
  },
];

export function AndonStatusWidget({ scope = "factory", idSetor = null, title }) {
  const { data, loading, error } = useAndonStatus(scope, idSetor);
  const heading = title ?? (scope === "sector" ? "Status das Máquinas do Setor" : "Status das Máquinas");

  if (loading) return <p className="text-xs text-muted-foreground">Carregando...</p>;
  if (error) return <p className="text-xs text-red-500">Erro ao carregar dados.</p>;
  if (!data) return <p className="text-xs text-muted-foreground">Nenhum dado encontrado.</p>;
  if (Array.isArray(data) && data.length === 0) return <p className="text-xs text-muted-foreground">Nenhum registro disponível.</p>;

  return (
    <div className="space-y-4 w-full h-full flex flex-col">
      <p className="text-md font-semibold text-slate-950 flex-shrink-0">{heading}</p>

      <div className="grid gap-4 grid-cols-3 w-full flex-1">
        {cards.map(({ key, label, accent }) => (
          <div
            key={key}
            className="flex w-full h-full flex-col rounded-xl border p-4 shadow-sm"
            style={{
              borderColor: accent,
              color: accent,
              backgroundColor: `color-mix(in srgb, ${accent} 8%, transparent)`,
            }}
          >
            <KPI
              title={label}
              value={Number(data[key]) || 0}
              type="number"
            />
          </div>
        ))}
      </div>
    </div>
  );
}