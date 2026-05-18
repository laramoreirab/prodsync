"use client";

import { useAndonStatus } from "./hooks/useAndonStatus";

const cards = [
  {
    key: "emProducao",
    label: "Em Produção",
    background: "bg-green-50",
    accent: "text-[#369948]",
  },
  {
    key: "emSetup",
    label: "Em Setup",
    background: "bg-yellow-50",
    accent: "text-[#ffac1e]",
  },
  {
    key: "emParada",
    label: "Em Parada",
    background: "bg-red-50",
    accent: "text-[#b30000]"
  },
];

export function AndonStatusWidget({ scope = "factory", idSetor = null, title }) {
  const { data, loading, error } = useAndonStatus(scope, idSetor);
  const heading = title ?? (scope === "sector" ? "Status das Máquinas do Setor" : "Status das Máquinas");

  if (loading) return <p className="text-sm text-muted-foreground">Carregando...</p>;
  if (error) return <p className="text-sm text-destructive">Erro ao carregar status.</p>;
  if (!data) return null;

  return (
    <div className="space-y-4">
      <p className="text-md font-semibold text-slate-950">{heading}</p>
      <div className="grid gap-4 grid-cols-3 w-full max-w-2xl mx-auto">
        {cards.map(({ key, label, background, accent}) => (
          <div
            key={key}
            className={`flex aspect-square flex-col items-center rounded-xl ${background} p-4 text-center shadow-sm`}
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
