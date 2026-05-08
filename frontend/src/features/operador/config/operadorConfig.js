export const eficienciaConfig = {
  eficiencia: { label: "Eficiência %:", color: "var(--chart-primary)" },
};

export const metaConfig = {
  completo: { label: "Completo:", color: "var(--chart-primary)" },
  restante: { label: "Restante:", color: "var(--chart-muted-fill)" },
};

export const metricas = [
  { key: "disponibilidade", label: "Disponibilidade:", color: "var(--chart-primary)" },
  { key: "performance",     label: "Performance:",     color: "var(--chart-primary)" },
  { key: "qualidade",       label: "Qualidade:",       color: "var(--chart-primary)" },
  { key: "oee",             label: "OEE Geral Consolidado:", color: "var(--chart-primary)" },
];

export const tempoParadoTempoProduzindoOperadorConfig  = {
  produzindo: { label: "Tempo Produzindo:", color: "var(--chart-accent)" },
  parada:       { label: "Tempo Parado:",        color: "var(--chart-secondary)" },
};

export const pecasPorDiaConfig = {
  qtd: { 
    label: "Peças:", 
    color: "var(--chart-primary)"
  },
};

export const producaoPorHoraConfig = {
  qtd: { label: "Peças/hora:", color: "var(--chart-primary)" },
};

export const produtividadeDiariaConfig = {
  produzido: { label: "Produzido:", color: "var(--chart-primary)" },
  meta:      { label: "Sua Meta:", color: "var(--chart-soft)" },
};

