// Status Operacional (DonutChart/PieChart)
export const maquinaStatusConfig = {
  ativa:  { label: "Máquinas ativas",     color: "#004aad" },
  parada: { label: "Máquinas paradas",    color: "#00357a" },
  setup:  { label: "Em Manutenção",       color: "#122f60" },
};

// Quantidade de máquinas por setor (BarHorizontal)
export const qtdMaquinasPorSetorConfig = {
  qtd: {
    label: "Qtd. Máquinas",
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
  produzidas: { label: "Produzidas",  color: "#00357a" },
  defeito:    { label: "Com Defeito", color: "#7d95c6" },
};

// Status por turno (BarStackedVertical)
export const maquinasTurnoConfig = {
  ativas:     { label: "Ativas",        color: "#004aad" },
  paradas:    { label: "Paradas",       color: "#7d95c6" },
  manutencao: { label: "Em Manutenção", color: "#122f60" },
};

// Produção total (AreaChart)
export const producaoTotalConfig = {
  total: {
    label: "Peças produzidas",
    color: "#00357a",
  },
};