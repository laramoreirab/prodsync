"use client";

import {useChartData } from "../useChartData";

export function useBarHorizontal() {
  return useChartData(async () => {
    // --- DADOS FAKE (substituir pela chamada real depois) ---
    return [
      { setor: "Engrenagens", qtd: 85 },
      { setor: "Turbinas",    qtd: 65 },
      { setor: "Válvulas",    qtd: 50 },
      { setor: "Compressores",qtd: 35 },
    ];
    // --------------------------------------------------------
  });
}
 