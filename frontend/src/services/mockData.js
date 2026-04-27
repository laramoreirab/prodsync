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
  titulo: "Peças por Minuto",
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

export const mockSetores = [
  { id: 1, setor: "Engrenagens", gestor: "Luis Antônio",    oeeMedio: 70, qtdMaquinas: 18, qtdOperadores: 18 },
  { id: 2, setor: "Roscas",      gestor: "Estevão Ferreira", oeeMedio: 80, qtdMaquinas: 20, qtdOperadores: 20 },
  { id: 3, setor: "Embalagens",  gestor: "Rodrigo Gois",    oeeMedio: 90, qtdMaquinas: 45, qtdOperadores: 45 },
  { id: 4, setor: "Turbinas",    gestor: "Carlos Silva",    oeeMedio: 56, qtdMaquinas: 66, qtdOperadores: 66 },
  { id: 5, setor: "Pistões",     gestor: "Ana Costa",       oeeMedio: 88, qtdMaquinas: 9,  qtdOperadores: 9  },
  { id: 6, setor: "Válvulas",    gestor: "Marcos Pinto",    oeeMedio: 99, qtdMaquinas: 20, qtdOperadores: 20 },
  { id: 7, setor: "Rolamentos",  gestor: "Fernanda Lima",   oeeMedio: 45, qtdMaquinas: 33, qtdOperadores: 33 },
  { id: 8, setor: "Soldagem",    gestor: "Ricardo Neves",   oeeMedio: 34, qtdMaquinas: 15, qtdOperadores: 15 },
  { id: 9, setor: "Montagem",    gestor: "Patrícia Souza",  oeeMedio: 76, qtdMaquinas: 7,  qtdOperadores: 7  },
];

export const mockSetorTotalKPI = {
  titulo:    "Número Total de Setores",
  subtitulo: "Atualizado em tempo real",
  valor:     "4",
};

export const mockOperadoresMediaKPI = {
  titulo:    "Número de operadores por setor (média)",
  subtitulo: "Atualizado em tempo real",
  valor:     "12",
};

export const mockOEEPorSetor = [
  { setor: "Engrenagens", oee: 90 },
  { setor: "Roscas",      oee: 82 },
  { setor: "Usinagem",    oee: 78 },
  { setor: "Fundição",    oee: 72 },
  { setor: "Montagem",    oee: 68 },
  { setor: "Embalagens",  oee: 65 },
  { setor: "Pintura",     oee: 58 },
  { setor: "Soldagem",    oee: 52 },
  { setor: "Corte CNC",   oee: 45 },
  { setor: "Injeção",     oee: 35 },
  { setor: "Acabamento",  oee: 28 },
  { setor: "Logística",   oee: 88 },
];

export const mockRefugoPorSetor = [
  { setor: "Engrenagens", refugo: 95 },
  { setor: "Roscas",      refugo: 85 },
  { setor: "Embalagens",  refugo: 60 },
  { setor: "Injeção",     refugo: 30 },
  { setor: "Usinagem",    refugo: 80 },
];

export const mockOEECritico = {
  setor: "Injeção",
  oee:   35,
};


export const mockParadasComparadas = [
  { name: "justificada",      value: 62 },
  { name: "naoJustificada",     value: 23 },
];

export const mockTopMotivosTempo = [
  { motivo: "Limpeza",           tempo: "2h 30m", minutos: 150 },
  { motivo: "Manutenção",        tempo: "1h 10m", minutos: 70  },
  { motivo: "Falta de Material", tempo: "45m",    minutos: 45  },
];


export const mockQtdMaquinasPorSetor = [
  { setor: "Engrenagens", qtd: 80 },
  { setor: "Turbinas",    qtd: 55 },
  { setor: "Válvulas",    qtd: 35 },
  { setor: "Compressores",qtd: 20 },
];

export const mockTempoMedioParada = [
  { setor: "Compressores", minutos: 46 },
  { setor: "Turbinas",     minutos: 38 },
  { setor: "Válvulas",     minutos: 30 },
  { setor: "Engrenagens",  minutos: 15 },
];

export const mockProducaoDefeitos = [
  { setor: "Engrenagens",  produzidas: 85, defeito: 15 },
  { setor: "Turbinas",     produzidas: 72, defeito: 28 },
  { setor: "Válvulas",     produzidas: 60, defeito: 40 },
  { setor: "Compressores", produzidas: 55, defeito: 45 },
];

export const mockMaquinasPorTurno = [
  { turno: "Manhã", ativas: 80, paradas: 12, manutencao: 8  },
  { turno: "Tarde", ativas: 72, paradas: 18, manutencao: 10 },
  { turno: "Noite", ativas: 65, paradas: 20, manutencao: 15 },
];

// ProducaoTotal — três datasets para os filtros de período
export const mockProducaoTotal3Meses = [
  { data: "Abr 2",  total: 650  },
  { data: "Abr 9",  total: 720  },
  { data: "15 Abr", total: 890  },
  { data: "16 Abr", total: 1200 },
  { data: "23 Abr", total: 980  },
  { data: "7 Mai",  total: 750  },
  { data: "14 Mai", total: 820  },
  { data: "22 Mai", total: 900  },
  { data: "6 Jun",  total: 780  },
  { data: "13 Jun", total: 850  },
  { data: "20 Jun", total: 770  },
];

export const mockProducaoTotal30Dias = [
  { data: "28 Mai", total: 600 },
  { data: "1 Jun",  total: 720 },
  { data: "5 Jun",  total: 810 },
  { data: "10 Jun", total: 750 },
  { data: "15 Jun", total: 900 },
  { data: "20 Jun", total: 680 },
  { data: "25 Jun", total: 790 },
  { data: "27 Jun", total: 820 },
];

export const mockProducaoTotal7Dias = [
  { data: "Seg", total: 750 },
  { data: "Ter", total: 820 },
  { data: "Qua", total: 690 },
  { data: "Qui", total: 910 },
  { data: "Sex", total: 840 },
  { data: "Sáb", total: 600 },
  { data: "Dom", total: 450 },
];


export const mockQtdUsuariosPorPerfil = [
  { name: "gestores",   value: 8  },
  { name: "operadores", value: 92 },
];

export const mockQtdUsuariosPorSetor = [
  { setor: "Engrenagens", qtd: 80 },
  { setor: "Turbinas",    qtd: 55 },
  { setor: "Válvulas",    qtd: 35 },
  { setor: "Compressores",qtd: 20 },
];

// Top 5 operadores 
export const mockTopOperadores = [
  { setor: "Marcos",  media: 40 },
  { setor: "Victória",media: 42 },
  { setor: "Joana",   media: 22 },
  { setor: "Andrew",  media: 18 },
  { setor: "Mauro",   media: 30 },
];

export const mockTempoSessaoPerfil = [
  { perfil: "Gestores",   horas: 1.42, label: "01:25 h" },
  { perfil: "Operadores", horas: 0.50, label: "00:30 h" },
];

export const mockRotatividade = [
  { mes: "Abr", novos: 14, desligados: 6  },
  { mes: "Mai", novos: 18, desligados: 10 },
  { mes: "Jun", novos: 25, desligados: 15 },
];

// Sobrecarga 
export const mockSobrecargaSetor = [
  { setor: "Engrenagens", media: 95 },
  { setor: "Turbinas",    media: 70 },
  { setor: "Válvulas",    media: 55 },
  { setor: "Compressores",media: 40 },
];

// Produção média 
export const mockProducaoMediaSetor = [
  { setor: "Engrenagens", media: 56 },
  { setor: "Turbinas",    media: 48 },
  { setor: "Válvulas",    media: 35 },
  { setor: "Compressores",media: 29 },
];

export const mockOPAtivasKPI = {
  titulo: "Número Total de OPs Ativas",
  valor:  "4",
};

export const mockOPAtrasadasKPI = {
  titulo: "Número Total de OPs Atrasadas",
  valor:  "2",
};

export const mockOPPecasBoas = {
  titulo: "Peças boas",
  valor:  "12.340",
};

export const mockOPRefugoKPI = {
  titulo: "Refugo",
  valor:  "312",
};

export const mockOPEficiencia = {
  eficiencia: 67,
};

export const mockOPTopRefugo = [
  { op: "#4491 (Elc)", refugo: 48 },
  { op: "#4480 (Pino)", refugo: 29 },
  { op: "#4490 (Eng)", refugo: 14 },
];

export const mockOPCargaSetor = [
  { setor: "Usinagem", carga: 8 },
  { setor: "Injeção",  carga: 4 },
  { setor: "Montagem", carga: 2 },
];

export const mockOPStatus = [
  { name: "emProducao",       value: 35 },
  { name: "pausadasSetup",    value: 25 },
  { name: "atrasadas",        value: 13 },
  { name: "aguardandoInicio", value: 27 },
];

export const mockOPConcluidasDia = [
  { dia: "Dia 1", total: 55 },
  { dia: "Dia 2", total: 68 },
  { dia: "Dia 3", total: 80 },
  { dia: "Dia 4", total: 73 },
  { dia: "Dia 5", total: 85 },
  { dia: "Dia 6", total: 82 },
  { dia: "Dia 7", total: 95 },
];


export const mockOEEOperador = {
  disponibilidade: 85,
  performance:     90,
  qualidade:       90,
  oee:             Math.round((85 * 90 * 90) / 10000), 
}

export const mockPecasPorDia = [
  { dia: "Seg", qtd: 80 },
  { dia: "Ter", qtd: 65 },
  { dia: "Qua", qtd: 78 },
  { dia: "Qui", qtd: 72 },
  { dia: "Sex", qtd: 60 },
  { dia: "Sáb", qtd: 55 },
];

export const mockProducaoPorHoraOperador = [
  { hora: "0",  qtd: 12 },
  { hora: "3",  qtd: 18 },
  { hora: "6",  qtd: 22 },
  { hora: "9",  qtd: 15 },
  { hora: "12", qtd: 20 },
  { hora: "15", qtd: 17 },
  { hora: "18", qtd: 14 },
  { hora: "21", qtd: 16 },
];

export const mockMetaProducao = {
  completo: 92,
  restante: 8,
};

export const mockParadasComparadasOperador = [
  { dia: "Seg", registradas: 8,  reais: 7  },
  { dia: "Ter", registradas: 7,  reais: 12 },
  { dia: "Qua", registradas: 13, reais: 15 },
  { dia: "Sex", registradas: 9,  reais: 8  },
];

export const mockEficienciaMaquina = [
  { maquina: "THA-1", eficiencia: 85 },
  { maquina: "THA-2", eficiencia: 60 },
  { maquina: "THA-3", eficiencia: 72 },
  { maquina: "THA-4", eficiencia: 90 },
];

export const mockMotivoRefugoMaquina = [
  { name: "Rolhas na Injeção", value: 43 },
  { name: "Peça Incompleta",   value: 29 },
  { name: "Rebarba Grossa",    value: 28 },
];

export const mockMotivoSetupMaquina = [
  { motivo: "Limpeza",           minutos: 150 },
  { motivo: "Manutenção",        minutos: 95  },
  { motivo: "Falta de Material", minutos: 70  },
];

export const mockOEEMaquina = {
  disponibilidade: 85,
  performance:     90,
  qualidade:       90,
  oee:             Math.round((85 * 90 * 90) / 10000),
};

export const mockOEEEvolucaoMaquina = [
  { dia: "Dia 1", oee: 65 },
  { dia: "Dia 2", oee: 78 },
  { dia: "Dia 3", oee: 70 },
  { dia: "Dia 4", oee: 82 },
  { dia: "Dia 5", oee: 79 },
  { dia: "Dia 6", oee: 85 },
  { dia: "Dia 7", oee: 92 },
];

export const mockVelocidadeMaquina = [
  { tipo: "Velocidade Normal", valor: 45 },
  { tipo: "Velocidade Atual",  valor: 38 },
];

export const mockSetorMaquinaStatus = {
  emProducao: 12,
  emSetup: 3,
  emParada: 2,
};

export const mockSetorOEEMedio = {
  setor: "Engrenagens",
  oee: 75,
};

export const mockSetorOEEEvolucao = [
  { dia: "Dia 1", oee: 65 },
  { dia: "Dia 2", oee: 80 },
  { dia: "Dia 3", oee: 75 },
  { dia: "Dia 4", oee: 78 },
  { dia: "Dia 5", oee: 85 },
  { dia: "Dia 6", oee: 83 },
  { dia: "Dia 7", oee: 90 },
];

export const mockSetorTopOperadores = [
  { operador: "Márcio",  qtd: 60 },
  { operador: "Vinícius", qtd: 45 },
  { operador: "Josefe",  qtd: 80 },
  { operador: "Antônio", qtd: 30 },
  { operador: "Maria",   qtd: 42 },
];

export const mockSetorMotivosParada = [
  { motivo: "Manutenção",        qtd: 45 },
  { motivo: "Falta de Materiais", qtd: 38 },
  { motivo: "Limpeza",           qtd: 28 },
];

export const mockSetorProducaoSemanal = [
  { dia: "Segunda", qtd: 120 },
  { dia: "Terça",   qtd: 150 }, 
  { dia: "Quarta",  qtd: 130 },
  { dia: "Quinta",  qtd: 170 },
  { dia: "Sexta",   qtd: 160 },
  { dia: "Sábado",  qtd: 90  },
  { dia: "Domingo", qtd: 50  },
];
 
export const mockOPProgresso = {
  produzidos: 82.8,
  aProduzir:  17.2,
};
 
export const mockOPOEEDetalhe = {
  disponibilidade: 85,
  performance:     90,
  qualidade:       90,
  oee:             72.5,
};

export const mockAndonStatusMaquinas = {
  emProducao: 12,
  emSetup:     3,
  emParada:    2,
};
 
export const mockAndonRanking = [
  { setor: "THAK-9879", produtividade: 95 },
  { setor: "THAK-9878", produtividade: 80 },
  { setor: "THAK-9877", produtividade: 70 },
  { setor: "THAK-9876", produtividade: 55 },
];