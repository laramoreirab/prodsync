"use client";

import { useAndonStatus } from "./hooks/useAndonStatus";

const cards = [
  {
    key: "emProducao",
    label: "Em Produção",
    border: "border-[#369948] dark:border-emerald-200",
    accent: "text-[#369948]",
  },
  {
    key: "emSetup",
    label: "Em Setup",
    border: "border-[#ffac1e] dark:border-amber-200",
    accent: "text-[#ffac1e]",
  },
  {
    key: "emParada",
    label: "Em Parada",
    border: "border-[#b30000] dark:border-red-400",
    accent: "text-[#b30000]"
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
      <p className="text-md font-semibold text-slate-950">{heading}</p>
      <div className="grid gap-4 grid-cols-3 w-full max-w-2xl mx-auto">
        {cards.map(({ key, label, border, accent}) => (
          <div
            key={key}
            className={`flex aspect-square flex-col items-center border ${border} rounded-xl p-4 text-center shadow-sm`}
          >
            <span className={`text-lg font-semibold ${accent} leading-tight`}>
              {label}
            </span>

            <div className="flex flex-1 items-center justify-center">
              <span className={`text-4xl font-bold text-blacl`}>
                {data[key]}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
