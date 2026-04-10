"use client";

import { useChartData } from "../useChartData";

export function useDailyProduction() {
  return useChartData(async () => {
    // --- DADOS FAKE (substituir pela chamada real depois) ---
    return [
      { hora: "00h", pcs: 800 },
      { hora: "02h", pcs: 1200 },
      { hora: "04h", pcs: 1100 },
      { hora: "06h", pcs: 2000 },
      { hora: "08h", pcs: 2800 },
      { hora: "10h", pcs: 3200 },
      { hora: "12h", pcs: 3500 },
      { hora: "14h", pcs: 3800 },
      { hora: "16h", pcs: 4200 },
      { hora: "18h", pcs: 4500 },
      { hora: "20h", pcs: 4300 },
      { hora: "22h", pcs: 3900 },
    ];
    // --------------------------------------------------------
  });
}