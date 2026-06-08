"use client";

import { KPI } from "@/components/ui/charts/components";
import { useAndonStatus } from "./hooks/useAndonStatus";

const cards = [
  {
    key: "emProducao",
    label: "Em Produção",
    bg: "bg-green-50 dark:bg-green-950/40",
    accent: "text-[#369948] dark:text-green-400",
  },
  {
    key: "emSetup",
    label: "Em Setup",
    bg: "bg-yellow-50 dark:bg-yellow-950/40",
    accent: "text-[#ffac1e] dark:text-yellow-400",
  },
  {
    key: "emParada",
    label: "Em Parada",
    bg: "bg-red-50 dark:bg-red-950/40",
    accent: "text-[#b30000] dark:text-red-400",
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
      <p className="text-md font-semibold text-slate-950 dark:text-slate-100 shrink-0">{heading}</p>
      <div className="grid gap-4 grid-cols-3 w-full flex-1">
        {cards.map(({ key, label, bg, accent }) => (
          <div
            key={key}
            className={`flex w-full h-full flex-col rounded-xl p-4 ${bg}`}
          >
            <KPI
              title={label}
              value={Number(data[key]) || 0}
              type="number"
              titleClass={accent}
            />
          </div>
        ))}
      </div>
    </div>
  );
}