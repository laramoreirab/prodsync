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
    accent: "#b30000",
  },
];

export function AndonStatusWidget({ scope = "factory", idSetor = null, title }) {
  const { data, loading, error } = useAndonStatus(scope, idSetor);
  const heading = title ?? (scope === "sector" ? "Status das Máquinas do Setor" : "Status das Máquinas");

  if (loading) return <p className="text-sm text-muted-foreground">Carregando...</p>;
  if (error) return <p className="text-sm text-destructive">Erro ao carregar status.</p>;
  if (!data) return null;

  return (
    <div className="space-y-4 w-full h-full flex flex-col">
      <p className="text-md font-semibold text-slate-950 flex-shrink-0">{heading}</p>
      
      <div className="grid gap-4 grid-cols-3 w-full flex-1">
        {cards.map(({ key, label, accent }) => (
          <div
            key={key}
            className="flex w-full h-full flex-col rounded-xl bg-transparent border p-4 shadow-sm"
            style={{ 
              borderColor: accent, 
              color: accent 
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