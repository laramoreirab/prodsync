export const producaoSetorConfig = {
  qtd: {
    label: "Peças produzidas:",
    color: "var(--color-grafico-colunas)",
  },
};

export const producaoDiaConfig = {
  pcs: {
    label: "Peças/hora:",
    color: "var(--color-grafico-area)",
  },
};

export const oeeMetricasConfig = [
  { key: "disponibilidade", label: "Disponibilidade:", color: "var(--color-grafico-area)" },
  { key: "performance",     label: "Performance:",     color: "var(--color-grafico-area)" },
  { key: "qualidade",       label: "Qualidade:",       color: "var(--color-grafico-area)" },
  { key: "oee",             label: "OEE Geral:",       color: "var(--color-grafico-area)" },
];