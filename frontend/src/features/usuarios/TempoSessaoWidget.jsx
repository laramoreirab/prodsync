"use client";
import { useTempoSessao } from "./hooks/useTempoSessao";

export function TempoSessaoWidget({ setorId }) {
  const { data, loading, error } = useTempoSessao(setorId);

  if (loading) return <p className="text-xs text-muted-foreground">Carregando...</p>;
  if (error) return <p className="text-sm text-destructive">Erro ao carregar dados.</p>;
  if (!data) return <p className="text-xs text-muted-foreground">Nenhum dado encontrado.</p>;
  if (Array.isArray(data) && data.length === 0) return <p className="text-xs text-muted-foreground">Nenhum registro disponível.</p>;

  const perfisData = Array.isArray(data)
    ? data.reduce((acc, item) => {
        if (!acc.some((entry) => entry.perfil === item.perfil)) {
          acc.push(item);
        }
        return acc;
      }, [])
    : [];

  const maxMinutos = perfisData.length ? Math.max(...perfisData.map((d) => d.minutos)) : 0;

  return (
    <div>
      <p className="text-sm font-semibold text-black dark:text-f8fafc">Tempo médio de sessão por perfil</p>
          <p className="text-[11px] text-muted-foreground font-medium mt-0.5">Atualizado em tempo real</p>

      <div className="flex flex-col gap-5">
        {perfisData.map(({ perfil, minutos, label }) => {
          const pct = maxMinutos ? Math.round((minutos / maxMinutos) * 100) : 0;

          return (
            <div key={perfil} className="flex items-center gap-4">
              <span className="w-24 text-sm font-semibold text-gray-700 dark:text-slate-300 flex-shrink-0">
                {perfil}
              </span>

              <div className="flex-1 bg-gray-100 dark:bg-[var(--chart-track)] border border-gray-100 dark:border-[var(--border)] rounded-full h-9 overflow-hidden">
                <div
                  className="h-full rounded-full bg-[var(--primary)] transition-all duration-500"
                  style={{ width: `${pct}%` }}
                />
              </div>

              <span className="w-20 text-sm font-bold text-gray-800 dark:text-slate-100 text-right flex-shrink-0">
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}