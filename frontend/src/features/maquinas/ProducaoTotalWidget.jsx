"use client";
import { useState, useEffect } from "react";
import { AreaChartBase } from "@/components/ui/charts/components/AreaChart";
import { producaoTotalConfig } from "./config/maquinaChartConfig";
import { apiFetch } from "@/lib/api";
// import { useProducaoTotal } from "./hooks/useProducaoTotal";


const PERIODOS = [
  { label: "Últimos 3 meses", dias: 90 },
  { label: "Últimos 30 dias", dias: 30 },
  { label: "Últimos 7 dias", dias: 7 },
];

export function ProducaoTotalWidget({ setorId }) {
  const [diasSelecionados, setDiasSelecionados] = useState(90);

  const [data, setData] = useState([]);
  

  async function carregarDados() {
    try {

      const response = await apiFetch(
        `/api/maquinas/dashboard/obter-producao-total-maquinas?dias=${diasSelecionados}`
      );

      setData(response.dados);

    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    carregarDados();
  }, [diasSelecionados]);

  const dadosGrafico = data.map(item => ({
    ...item,
    data: new Date(item.data).toLocaleDateString("pt-BR", {
      day: "numeric",
      month: "short",
    }),
  }));

  // const [periodoKey, setPeriodoKey] = useState("3meses");

  // const periodoAtual = PERIODOS.find((p) => p.key === periodoKey);
  // const data = periodoAtual.mock;
 
  return (
    <div className="w-full overflow-hidden"> {/* Garante que nada vaze */}
      <div className="flex flex-col gap-3 mb-4 sm:flex-row sm:items-center sm:justify-between">
        
        {/* Bloco do Título */}
        <div className="min-w-0"> 
          <p className="text-sm font-semibold text-black truncate">
            Produção total das máquinas
          </p>
          <p className="text-xs text-gray-400 font-semibold mt-1">
            *Atualizado em tempo real
          </p>
        </div>
  
        {/* Bloco dos Botões */}
        <div className="flex gap-2 pb-1 overflow-x-auto max-w-full sm:pb-0 sm:overflow-visible relative z-10 no-scrollbar">
          {PERIODOS.map(({ label, dias }) => (
            <button
              key={dias}
              onClick={() => setDiasSelecionados(dias)}
              className={`h-8 px-3 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap flex-shrink-0 ${
                diasSelecionados === dias
                  ? "bg-[var(--secondary-foreground)] text-white shadow-sm"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
  
      </div>
  
      {/* Gráfico */}
      <div className="w-full overflow-x-auto">
        <AreaChartBase data={dadosGrafico} xKey="data" yKey="total" config={producaoTotalConfig} />
      </div>
    </div>
  );
}
