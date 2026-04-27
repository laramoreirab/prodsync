"use client";

import { useAndonStatus } from "./hooks/useAndonStatus";

const cards = [
  { key: "emProducao", label: "Em Produção", border: "border-green-500",  text: "text-green-600"  },
  { key: "emSetup",    label: "Em Setup",    border: "border-yellow-400", text: "text-yellow-500" },
  { key: "emParada",   label: "Em Parada",   border: "border-red-500",    text: "text-red-600"    },
];

export function AndonStatusWidget() {
  const { data, loading, error } = useAndonStatus();

  if (loading) return <p className="text-sm text-muted-foreground">Carregando...</p>;
  if (error)   return <p className="text-sm text-destructive">Erro ao carregar status.</p>;
  if (!data)   return null;

  return (
    <div>
      <p className="text-sm font-semibold text-black mb-3">Status das Máquinas</p>
      <div className="flex gap-4">
        {cards.map(({ key, label, border, text }) => (
          <div
            key={key}
            className={`flex-1 border-2 ${border} rounded-xl p-4 flex flex-col items-center gap-2`}
          >
            <span className="text-xs font-semibold text-gray-500 text-center">{label}</span>
            <span className={`text-5xl font-medium ${text}`}>{data[key]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}