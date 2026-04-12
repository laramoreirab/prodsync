export const mockProducaoPorSetor = [
  { setor: "Engrenagens", qtd: 320 },
  { setor: "Turbinas", qtd: 210 },
  { setor: "Pistões", qtd: 180 },
  { setor: "Válvulas", qtd: 150 },
];

export const mockProducaoPorHora = [
  { hora: "06h", pcs: 45 },
  { hora: "08h", pcs: 72 },
  { hora: "10h", pcs: 88 },
  { hora: "12h", pcs: 61 },
  { hora: "14h", pcs: 95 },
  { hora: "16h", pcs: 83 },
];

export const mockOEE = {
  disponibilidade: 87,
  performance: 76,
  qualidade: 94,
  oee: Math.round((87 * 76 * 94) / 10000), 
};

export const mockMaquinaStatus = [
  { name: "ativa",      value: 62 },
  { name: "parada",     value: 23 },
  { name: "setup", value: 15 },
];