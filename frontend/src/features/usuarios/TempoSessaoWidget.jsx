"use client";
import { setorCrudService } from "@/services/setorCrudService";
import { useTempoSessao } from "./hooks/useTempoSessao";

export function TempoSessaoWidget({ setorId }) {
  const { data, loading, error } = useTempoSessao(setorId); 
  if (loading) return <p className="text-xs text-muted-foreground">Carregando...</p>;
  if (error) return <p className="text-xs text-red-500">Erro ao carregar dados.</p>;
  if (!data || data.length === 0) return <p className="text-xs">Nenhum registro disponível.</p>;

  const dadosFiltrados = data.filter((item) => {
    return !setorId || item.setorId === setorId;
  });

  const maxHorasScale = data.length 
    ? Math.max(...data.map(d => d.horas)) 
    : 1;

  return (
    <div className="flex flex-col h-full w-full">
      <div className="mb-6">
        <p className="text-sm font-semibold text-black leading-tight">
          Tempo médio de sessão por perfil
        </p>
        <p className="text-[10px] text-gray-400 font-semibold mt-1 italic uppercase">
          {setorId ? `Exibindo Setor: ${setorId}` : "Exibindo Todos os Setores"}
        </p>
      </div>

      <div className="flex flex-col gap-5">
        {dadosFiltrados.map(({ perfil, horas, label, setorId: sId }, index) => {
            const pct = Math.round((horas / maxHorasScale) * 100);

          return (
            <div key={`${sId}-${perfil}-${index}`} className="flex items-center gap-4">
              {/* Nome do Perfil + ID do Setor (opcional para clareza quando mostra todos) */}
              <div className="w-32 flex flex-col flex-shrink-0">
                <span className="text-sm font-semibold text-gray-700 leading-none">
                  {perfil}
                </span>
                {!setorId && (
                  <span className="text-[9px] text-gray-400 font-bold uppercase">
                    Setor {sId}
                  </span>
                )}
              </div>

              {/* Barra de Progresso */}
              <div className="flex-1 bg-gray-100 rounded-full h-8 overflow-hidden">
                <div
                  className="h-full rounded-full bg-[var(--chart-primary)] transition-all duration-700"
                  style={{ width: `${pct}%` }} 
                />
              </div>

              {/* Label de Tempo */}
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