"use client";

import { useAndonStatus } from "./hooks/useAndonStatus";

const cards = [
  {
    key: "emProducao",
    label: "Em Produção",
    border: "border-emerald-200",
    accent: "text-emerald-700",
  },
  {
    key: "emSetup",
    label: "Em Setup",
    border: "border-amber-200",
    accent: "text-amber-700",
  },
  {
    key: "emParada",
    label: "Em Parada",
    border: "border-rose-200",
    accent: "text-rose-700",
  },
];

export function AndonStatusWidget({ scope = "factory", title }) {
  const { data, loading, error } = useAndonStatus(scope);
  const heading = title ?? (scope === "sector" ? "Status das Máquinas do Setor" : "Status das Máquinas");

  if (loading) return <p className="text-sm text-muted-foreground">Carregando...</p>;
  if (error) return <p className="text-sm text-destructive">Erro ao carregar status.</p>;
  if (!data) return null;

  return (
    <div className="space-y-4">
      <p className="text-sm font-semibold text-slate-950">{heading}</p>

      <div className="grid gap-3 sm:grid-cols-3">
        {cards.map(({ key, label, border, accent }) => (
          <div
            key={key}
            className={`flex min-h-28 flex-col items-center justify-center gap-2 rounded-lg border ${border} bg-white px-4 py-5 text-center`}>
            <span className="text-xs font-semibold text-slate-500">{label}</span>
            <span className={`text-5xl font-medium tracking-tight text-slate-900 ${accent}`}>
              {data[key]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
