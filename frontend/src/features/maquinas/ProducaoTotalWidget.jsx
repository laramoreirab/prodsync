// src/features/maquinas/ProducaoTotalWidget.jsx
"use client";

import { useState } from "react";
import { AreaChartBase } from "@/components/ui/charts/components/AreaChart";
import { producaoTotalConfig } from "./config/maquinaChartConfig";
import {
  mockProducaoTotal3Meses,
  mockProducaoTotal30Dias,
  mockProducaoTotal7Dias,
} from "@services/mockData";

// Em produção, trocar os mocks por chamadas à API com o período como parâmetro:
// const data = await apiFetch(`/maquinas/producao_total?periodo=${periodo}`)

const PERIODOS = [
  { label: "Últimos 3 meses", key: "3meses",  mock: mockProducaoTotal3Meses  },
  { label: "Últimos 30 dias", key: "30dias",  mock: mockProducaoTotal30Dias  },
  { label: "Últimos 7 dias",  key: "7dias",   mock: mockProducaoTotal7Dias   },
];

export function ProducaoTotalWidget() {
  const [periodoKey, setPeriodoKey] = useState("3meses");

  const periodoAtual = PERIODOS.find((p) => p.key === periodoKey);
  const data = periodoAtual.mock;

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
              className={`h-8 rounded-lg border px-3 text-xs font-semibold transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7d95c6] ${
                periodoKey === key
                  ? "border-[#00357a] bg-[#00357a] text-[#f8f8f8] shadow-sm dark:border-[#a9b9dc] dark:bg-[#a9b9dc] dark:text-[#0b1020]"
                  : "border-[#c3c7c8] bg-[#f8f8f8] text-[#23304c] hover:border-[#7d95c6] hover:bg-[#eef2f8] dark:border-[#7d95c6]/45 dark:bg-[#0f172a] dark:text-[#f8f8f8] dark:hover:bg-[#1b2740]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <AreaChartBase
        data={data}
        xKey="data"
        yKey="total"
        config={producaoTotalConfig}
      />
    </div>
  );
}
