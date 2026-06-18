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
      const params = new URLSearchParams({ dias: String(diasSelecionados) });
      if (setorId) params.set("setorId", String(setorId));

      const response = await apiFetch(
        `/api/maquinas/dashboard/obter-producao-total-maquinas?${params.toString()}`
      );

      setData(response.dados);

    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    carregarDados();
  }, [diasSelecionados, setorId]);

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
          <p className="text-lg font-semibold text-black truncate dark:text-[#f4f8ff]">
            Produção total das máquinas
          </p>
          <p className="text-md text-muted-foreground font-medium mt-0.5">Atualizado em tempo real</p>

        </div>
  
        {/* Bloco dos Botões */}
        <div className="flex gap-2 pb-1 overflow-x-auto max-w-full sm:pb-0 sm:overflow-visible relative z-10 no-scrollbar">
          {PERIODOS.map(({ label, dias }) => (
            <button
              key={dias}
              onClick={() => setDiasSelecionados(dias)}
              className={`h-8 px-3 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap flex-shrink-0 ${
                diasSelecionados === dias
                  ? "bg-[#315aa8] text-white shadow-sm hover:bg-[#3868c2] dark:bg-[#2f63c7] dark:text-[#f4f8ff] dark:shadow-[0_8px_22px_rgba(47,99,199,0.28)] dark:hover:bg-[#3b73dc]"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:border dark:border-[#243754] dark:bg-[#101b31] dark:text-[#aebbd1] dark:hover:border-[#365b94] dark:hover:bg-[#17253f] dark:hover:text-[#f4f8ff]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
  
      </div>
  
      {/* Gráfico */}
      <div className="w-full overflow-x-auto">
        <AreaChartBase data={dadosGrafico} xKey="data" yKey="total" config={producaoTotalConfig} size="medio" />
      </div>
    </div>
  );
}
