// Status Operacional (DonutChart/PieChart)
export const maquinaStatusConfig = {
ativa:  { label: "Ativa",     color: "var(--azul-cobalto)" },
  parada: { label: "Parada",    color: "var(--chart-primary)" },
  setup:  { label: "Setup",       color: "var(--chart-deep)" },
};

// Quantidade de máquinas por setor (BarHorizontal)
export const qtdMaquinasPorSetorConfig = {
  quantidade: {
    label: "Qtd. Máquinas:",
    color: "#7d95c6",
  },
};

// Tempo médio de parada por setor (BarVertical)
export const tempoMedioParadaConfig = {
  minutos: {
    label: "Minutos",
    color: "#7d95c6",
  },
};

// Produção vs Defeito por setor (BarStackedHorizontal)
export const producaoDefeitosConfig = {
  produzidas: { label: "Produzidas:",  color: "#00357a" },
  defeito:    { label: "Com Defeito:", color: "#7d95c6" },
};

// Status por turno (BarStackedVertical)
export const maquinasTurnoConfig = {
  ativas:     { label: "Ativas:",        color: "#004aad" },
  paradas:    { label: "Paradas:",       color: "#7d95c6" },
  manutencao: { label: "Setup:", color: "#122f60" },
};

// Produção total (AreaChart)
export const producaoTotalConfig = {
  total: {
    label: "Peças produzidas:",
    color: "#00357a",
  },
};