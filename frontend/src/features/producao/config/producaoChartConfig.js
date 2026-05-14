export const producaoSetorConfig = {
  qtd: {
    label: "Peças produzidas:",
    color: "var(--chart-accent)",
  },
};

export const producaoDiaConfig = {
  pcs: {
    label: "Peças/hora:",
    color: "var(--chart-primary)",
  },
};

export const oeeMetricasConfig = [
  { key: "disponibilidade", label: "Disponibilidade:", color: "var(--chart-primary)" },
  { key: "performance",     label: "Performance:",     color: "var(--chart-primary)" },
  { key: "qualidade",       label: "Qualidade:",       color: "var(--chart-primary)" },
  { key: "oee",             label: "OEE Geral:",       color: "var(--chart-primary)" },
];

const metricasConfig = [
  { key: "disponibilidade", label: "Disponibilidade",      color: "var(--chart-primary)" },
  { key: "performance",     label: "Performance",          color: "var(--chart-primary)" },
  { key: "qualidade",       label: "Qualidade",            color: "var(--chart-primary)" },
  { key: "oee",             label: "OEE Geral Consolidado", color: "var(--chart-primary)" },
];