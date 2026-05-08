// Status Operacional (DonutChart/PieChart)
export const maquinaStatusConfig = {
  ativa:  { label: "Máquinas ativas:",     color: "var(--azul-cobalto)" },
  parada: { label: "Máquinas paradas:",    color: "var(--chart-primary)" },
  setup:  { label: "Em Manutenção:",       color: "var(--chart-deep)" },
};

// Quantidade de máquinas por setor (BarHorizontal)
export const qtdMaquinasPorSetorConfig = {
  qtd: {
    label: "Qtd. Máquinas:",
    color: "var(--chart-accent)",
  },
};

// Tempo médio de parada por setor (BarVertical)
export const tempoMedioParadaConfig = {
  minutos: {
    label: "Minutos",
    color: "var(--chart-accent)",
  },
};

// Produção vs Defeito por setor (BarStackedHorizontal)
export const producaoDefeitosConfig = {
  produzidas: { label: "Produzidas:",  color: "var(--chart-primary)" },
  defeito:    { label: "Com Defeito:", color: "var(--chart-accent)" },
};

// Status por turno (BarStackedVertical)
export const maquinasTurnoConfig = {
  ativas:     { label: "Ativas:",        color: "var(--azul-cobalto)" },
  paradas:    { label: "Paradas:",       color: "var(--chart-accent)" },
  manutencao: { label: "Em Manutenção:", color: "var(--chart-deep)" },
};

// Produção total (AreaChart)
export const producaoTotalConfig = {
  total: {
    label: "Peças produzidas:",
    color: "var(--chart-primary)",
  },
};