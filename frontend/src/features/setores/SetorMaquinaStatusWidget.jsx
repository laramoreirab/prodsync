"use client";

import { useSetorMaquinaStatus } from "./hooks/useSetorMaquinaStatus";
import { KPI } from "@/components/ui/charts/components";

const statusCards = [
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

export function SetorMaquinaStatusWidget({ setorId }) {
  const { data, loading, error } = useSetorMaquinaStatus(setorId);

  if (loading) return <p className="text-sm text-muted-foreground">Carregando...</p>;
  if (error) return <p className="text-sm text-destructive">Erro ao carregar status.</p>;
  if (!data) return <p className="text-xs text-muted-foreground">Nenhum dado encontrado.</p>;
  if (Array.isArray(data) && data.length === 0) return <p className="text-xs text-muted-foreground">Nenhum registro disponível.</p>;


  return (
    <div className="flex flex-col gap-2">
      <div>
        <p className="text-sm font-semibold text-black">Status das Máquinas</p>
          <p className="text-[11px] text-muted-foreground font-medium mt-0.5">Atualizado em tempo real</p>
      </div>
      <div className="space-y-4 w-full h-full flex flex-col">
        <div className="grid gap-4 grid-cols-3 w-full flex-1">
          {statusCards.map(({ key, label, bg, accent }) => (
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

    </div>
  );
}