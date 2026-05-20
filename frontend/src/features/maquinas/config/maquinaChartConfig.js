// Status Operacional (DonutChart/PieChart)
export const maquinaStatusConfig = {
  produzindo:  { label: "Máquinas ativas:",     color: "var(--azul-cobalto)" },
  parada: { label: "Máquinas paradas:",    color: "#00357a" },
  setup:  { label: "Máquinas Setup:",       color:"#7d95c6" },
  manutencao:  { label: "Máquinas em manutenção:",       color: "var(--pencil)" },
  
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
  ativas:     { label: "Ativas:",        color: "var(--azul-cobalto)" },
  paradas:    { label: "Paradas:",       color: "#7d95c6" },
  manutencao: { label: "Setup:", color: "var(--pencil)" },
};

// Produção total (AreaChart)
export const producaoTotalConfig = {
  total: {
    label: "Peças produzidas:",
    color: "var(--color-grafico-area)",
  },
};
