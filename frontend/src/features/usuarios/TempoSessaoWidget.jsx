"use client";
import { useTempoSessao } from "./hooks/useTempoSessao";

export function TempoSessaoWidget({ setorId }) {
  const { data, loading, error } = useTempoSessao(setorId);

  if (loading) return <p className="text-xs text-muted-foreground">Carregando...</p>;
  if (error) return <p className="text-xs text-red-500">Erro ao carregar dados.</p>;
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
      <p className="text-sm font-semibold text-black">Tempo médio de sessão por perfil</p>
      <p className="text-xs text-gray-400 font-semibold mt-1 mb-6">*Atualizado em tempo real</p>

      <div className="flex flex-col gap-5">
        {perfisData.map(({ perfil, minutos, label }) => {
          const pct = maxMinutos ? Math.round((minutos / maxMinutos) * 100) : 0;

          return (
            <div key={perfil} className="flex items-center gap-4">
              {/* Nome do Perfil (Adm, Gestor, Operador) */}
              <span className="w-24 text-sm font-semibold text-gray-700 flex-shrink-0">
                {perfil}
              </span>

              {/* Barra de Progresso */}
              <div className="flex-1 bg-gray-100 border border-gray-100 rounded-full h-9 overflow-hidden">
                <div
                  className="h-full rounded-full bg-[var(--primary)] transition-all duration-500"
                  style={{ width: `${pct}%` }}
                />
              </div>

              {/* Label formatado vindo do Back (ex: "03:45 h") */}
              <span className="w-20 text-sm font-bold text-gray-800 text-right flex-shrink-0">
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}