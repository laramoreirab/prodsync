"use client";

import { useSetorMaquinaStatus } from "./hooks/useSetorMaquinaStatus";

const statusCards = [
  {
    key: "emProducao",
    label: "Em Produção",
    border: "border-green-500",
    text: "text-green-600",
  },
  {
    key: "emSetup",
    label: "Em Setup",
    border: "border-orange-400",
    text: "text-orange-500",
  },
  {
    key: "emParada",
    label: "Em Parada",
    border: "border-red-500",
    text: "text-red-600",
  },
];

export function SetorMaquinaStatusWidget({ setorId }) {
  const { data, loading, error } = useSetorMaquinaStatus(setorId);

  if (loading) return <p className="text-sm text-muted-foreground">Carregando...</p>;
  if (error) return <p className="text-sm text-destructive">Erro ao carregar status.</p>;
  if (!data) return null;

  return (
    <div className="flex flex-col gap-2">
      <div>
        <p className="text-sm font-semibold text-black">Status das Máquinas</p>
        <p className="text-xs text-gray-400 font-semibold mt-1">*Atualizado em tempo real</p>
      </div>

      <div className="flex gap-3 mt-2">
        {statusCards.map(({ key, label, border, text }) => (
          <div
            key={key}
            className={`flex-1 aspect-square border-2 ${border} rounded-lg p-2 flex flex-col items-center justify-center gap-1`}
          >
            <span className="text-[10px] uppercase tracking-wider font-bold text-gray-500 text-center leading-tight">
              {label}
            </span>
            <span className={`text-3xl font-bold ${text}`}>
              {data[key]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}