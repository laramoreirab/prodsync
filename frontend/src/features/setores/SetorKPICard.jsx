"use client";
import { useSetorTotalKPI } from "../hooks/useSetorTotalKPI";
import { useOperadoresMediaKPI } from "../hooks/useOperadoresMediaKPI";

function KPICard({ titulo, subtitulo, valor, loading, error }) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 flex flex-col gap-1 shadow-sm">
      <p className="text-sm font-medium text-slate-700 leading-tight">{titulo}</p>
      {subtitulo && (
        <p className="text-[11px] text-gray-400">{subtitulo}</p>
      )}
      <div className="mt-3">
        {loading && <p className="text-sm text-gray-400">Carregando...</p>}
        {error   && <p className="text-sm text-red-400">Erro ao carregar.</p>}
        {!loading && !error && (
          <span className="text-5xl font-medium text-slate-900">{valor}</span>
        )}
      </div>
    </div>
  );
}

export function SetorTotalWidget() {
  const { data, loading, error } = useSetorTotalKPI();
  return (
    <KPICard
      titulo={data?.titulo ?? "Número Total de Setores"}
      subtitulo={data?.subtitulo}
      valor={data?.valor}
      loading={loading}
      error={error}
    />
  );
}

export function OperadoresMediaWidget() {
  const { data, loading, error } = useOperadoresMediaKPI();
  return (
    <KPICard
      titulo={data?.titulo ?? "Número de operadores por setor (média)"}
      subtitulo={data?.subtitulo}
      valor={data?.valor}
      loading={loading}
      error={error}
    />
  );
}