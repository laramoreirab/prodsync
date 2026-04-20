// Componente customizado — não há um base genérico 
"use client";
import { useTempoSessao } from "./hooks/useTempoSessao";

export function TempoSessaoWidget() {
  const { data, loading, error } = useTempoSessao();

  if (loading) return <p className="text-sm text-muted-foreground">Carregando...</p>;
  if (error)   return <p className="text-sm text-destructive">Erro ao carregar dados.</p>;

  const maxHoras = Math.max(...data.map((d) => d.horas));

  return (
    <div>
      <p className="text-sm font-semibold text-black">Tempo médio de sessão por perfil</p>
      <p className="text-xs text-gray-400 font-semibold mt-1 mb-6">*Atualizado em tempo real</p>

      <div className="flex flex-col gap-5">
        {data.map(({ perfil, horas, label }) => {
          const pct = Math.round((horas / maxHoras) * 100);

          return (
            <div key={perfil} className="flex items-center gap-4">

              <span className="w-24 text-sm font-semibold text-gray-700 flex-shrink-0">
                {perfil}
              </span>

              <div className="flex-1 bg-gray-100 rounded-full h-9 overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#23304c] transition-all duration-500"
                  style={{ width: `${pct}%` }}
                />
              </div>

              <span className="w-16 text-sm font-bold text-gray-800 text-right flex-shrink-0">
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}