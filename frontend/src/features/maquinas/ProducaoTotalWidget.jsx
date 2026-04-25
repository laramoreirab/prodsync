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
      <AreaChartBase
        data={data}
        xKey="data"
        yKey="total"
        config={producaoTotalConfig}
      />
    </div>
  );
}