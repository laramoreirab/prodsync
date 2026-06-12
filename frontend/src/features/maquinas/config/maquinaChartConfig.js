// Status Operacional (DonutChart/PieChart)
export const maquinaStatusConfig = {
  produzindo:  { label: "Máquinas ativas:",     color: "var(--chart1)" },
  parada: { label: "Máquinas Paradas:",    color: "var(--chart2)" },
  setup:  { label: "Máquinas Setup:",       color:"var(--chart3)" },
  manutencao:  { label: "Máquinas em manutenção:",       color: "var(--chart4)" },
  
};

// Quantidade de máquinas por setor (BarHorizontal)
export const qtdMaquinasPorSetorConfig = {
  quantidade: {
    label: "Qtd. Máquinas:",
    color: "var(--chart2)",
  },
};

// Tempo médio de parada por setor (BarVertical)
export const tempoMedioParadaConfig = {
  minutos: {
    label: "Minutos",
    color: "var(--chart2)",
  },
};

// Produção vs Defeito por setor (BarStackedHorizontal)
export const producaoDefeitosConfig = {
  produzidas: { label: "Produzidas:",  color: "var(--chart1)" },
  defeito:    { label: "Com Defeito:", color: "var(--chart2)" },
};

// Status por turno (BarStackedVertical)
export const maquinasTurnoConfig = {
  ativas:     { label: "Ativas:",        color: "var(--chart1)" },
  paradas:    { label: "Paradas:",       color: "var(--chart2)" },
  manutencao: { label: "Setup:", color: "var(--pencil)" },
};

// Produção total (AreaChart)
export const producaoTotalConfig = {
  total: {
    label: "Peças produzidas:",
    color: "var(--chart1)",
  },
};
