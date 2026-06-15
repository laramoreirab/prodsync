export const eficienciaConfig = {
  eficiencia: { label: "Eficiência %:", color: "var(--chart1)" },
};

export const metaConfig = {
  completo: { label: "Completo:", color: "var(--chart1)" },
  restante: { label: "Restante:", color: "#e2e8f0" },
};

export const metricas = [
  { key: "disponibilidade", label: "Disponibilidade:", color: "var(--chart1)" },
  { key: "performance",     label: "Performance:",     color: "var(--chart1)" },
  { key: "qualidade",       label: "Qualidade:",       color: "var(--chart1)" },
  { key: "oee",             label: "OEE Geral Consolidado:", color: "var(--chart1)" },
];

export const tempoParadoTempoProduzindoOperadorConfig  = {
  produzindo: { label: "Tempo Produzindo:", color: "var(--chart2)" },
  parada:       { label: "Tempo Parado:",        color: "var(--chart4)" },
};

export const pecasPorDiaConfig = {
  qtd: { 
    label: "Peças:", 
    color: "var(--chart1)" 
  },
};

export const producaoPorHoraConfig = {
  qtd: { label: "Peças/hora:", color: "var(--chart1)" },
};

export const produtividadeDiariaConfig = {
  produzido: { label: "Produzido:", color: "var(--chart2)" },
  meta:      { label: "Sua Meta:", color: "#b0bfd8" },
};
