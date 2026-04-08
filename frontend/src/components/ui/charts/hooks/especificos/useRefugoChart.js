import { useChartData } from "./useChartData";

export function useRefugoChart() {
  return useChartData(async () => {
    return [
      { dia: "Seg", refugo: 200 },
      { dia: "Ter", refugo: 350 },
      { dia: "Qua", refugo: 420 },
      { dia: "Qui", refugo: 380 },
      { dia: "Sex", refugo: 550 },
      { dia: "Sab", refugo: 480 },
      { dia: "Dom", refugo: 420 },
    ];
  });
}