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

export const mockMotivosFrequentesParadas = [
  { motivo : "Manutenção", qtd: 76},
  { motivo : "Falta de Materiais", qtd: 60},
  { motivo : "Limpeza", qtd: 45}
]


export const mockTendenciaRefugo = [
{ dia: "Dia 1", qtd: 45 },
  { dia: "Dia 2", qtd: 72 },
  { dia: "Dia 3", qtd: 88 },
  { dia: "Dia 4", qtd: 61 },
  { dia: "Dia 5", qtd: 95 },
  { dia: "Dia 6", qtd: 83 },
];

export const mockMediaParadasDia = {
  titulo: "Média de Paradas por Dia",
  valor: "1h"
};

export const mockPecasPorMinuto = {
  titulo: "Peças por MInuto",
  valor: "30"
};

export const mockMaquinaAtivaPorTurno = {
  titulo: "Maquina Ativa Por Turno",
  valor: "12"
};

export const mockProducaoPorTurnoLotes = {
  titulo: "Producao Por Turno por Lote",
  valor: "25"
};