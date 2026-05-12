"use client";
import { useState } from "react";
import { AreaChartBase } from "@/components/ui/charts/components/AreaChart";
import { producaoTotalConfig } from "./config/maquinaChartConfig";
import { useProducaoTotal } from "./hooks/useProducaoTotal";

const PERIODOS = [
  { label: "Últimos 3 meses", key: "3meses" },
  { label: "Últimos 30 dias", key: "30dias" },
  { label: "Últimos 7 dias",  key: "7dias"  },
];

export function ProducaoTotalWidget({ setorId }) {
  const [periodoKey, setPeriodoKey] = useState("3meses");
  const { data, loading, error } = useProducaoTotal(periodoKey, setorId);

  if (loading) return <p className="text-xs text-muted-foreground">Carregando...</p>;
  if (error)   return <p className="text-xs text-red-500">Erro ao carregar dados.</p>;
  if (!data)   return <p className="text-xs text-muted-foreground">Nenhum dado encontrado.</p>;
  if (Array.isArray(data) && data.length === 0) return <p className="text-xs text-muted-foreground">Nenhum registro disponível.</p>;
  
  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-2">
        <div>
          <p className="text-sm font-semibold text-black">Produção total das máquinas</p>
          <p className="text-xs text-gray-400 font-semibold mt-1">*Atualizado em tempo real</p>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          {PERIODOS.map(({ label, key }) => (
            <button
              key={key}
              onClick={() => setPeriodoKey(key)}
              className={`h-8 px-3 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
                periodoKey === key
                  ? "bg-[var(--secondary-foreground)] text-white shadow-sm"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <AreaChartBase data={data} xKey="data" yKey="total" config={producaoTotalConfig} />
    </div>
  );
}