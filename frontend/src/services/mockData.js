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
{ name: "ativa", value: 62, setorId: 1 },
  { name: "parada", value: 23, setorId: 1 },
  { name: "setup", value: 15, setorId: 1 },
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


export const mockTempoParadoTempoProduzindoOperador = [
  { dia: "Seg", produzindo: 8,  parada: 7  },
  { dia: "Ter", produzindo: 7,  parada: 12 },
  { dia: "Qua", produzindo: 13, parada: 15 },
  { dia: "Sex", produzindo: 9,  parada: 8  },
];

export const mockTopMotivosTempo = [
  { motivo: "Limpeza",           tempo: "2h 30m", minutos: 150 },
  { motivo: "Manutenção",        tempo: "1h 10m", minutos: 70  },
  { motivo: "Falta de Material", tempo: "45m",    minutos: 45  },
];


export const mockQtdMaquinasPorSetor = [
 { id: 1, setor: "Engrenagens", quantidade: 80 },
  { id: 2, setor: "Turbinas", quantidade: 55 },
  { id: 3, setor: "Válvulas", quantidade: 35 },
  { id: 4, setor: "Compressores", quantidade: 20 },
];

export const mockTempoMedioParada = [
  { maquina: "Prensa 01", minutos: 46, setorId: 1 },
  { maquina: "Fresa 02", minutos: 38, setorId: 1 },
  { maquina: "Torno 03", minutos: 30, setorId: 1 },
  { maquina: "CNC 04", minutos: 15, setorId: 1 },
  { maquina: "Prensa A1", minutos: 52, setorId: 2 },
  { maquina: "Fresa B2", minutos: 41, setorId: 2 },
  { maquina: "Torno C3", minutos: 35, setorId: 2 },
];

export const mockProducaoDefeitos = [
  { maquina: "Prensa 01", produzidas: 85, defeito: 15, setorId: 1 },
  { maquina: "Fresa 02", produzidas: 72, defeito: 28, setorId: 1 },
  { maquina: "Torno 03", produzidas: 60, defeito: 40, setorId: 1 },
  { maquina: "CNC 04", produzidas: 55, defeito: 45, setorId: 1 },
  { maquina: "Prensa A1", produzidas: 78, defeito: 22, setorId: 2 },
  { maquina: "Fresa B2", produzidas: 65, defeito: 35, setorId: 2 },
  { maquina: "Torno C3", produzidas: 58, defeito: 42, setorId: 2 },
];

export const mockMaquinasPorTurno = [
  { turno: "Manhã", ativas: 80, paradas: 12, manutencao: 8, setorId: 1 },
  { turno: "Tarde", ativas: 72, paradas: 18, manutencao: 10, setorId: 1 },
  { turno: "Noite", ativas: 65, paradas: 20, manutencao: 15, setorId: 1 },
];

// ProducaoTotal — três datasets para os filtros de período
export const mockProducaoTotal3Meses = [
  { data: "Abr 2",  total: 650, setorId: 1 },
  { data: "Abr 9",  total: 720, setorId: 1 },
  { data: "15 Abr", total: 890, setorId: 1 },
  { data: "16 Abr", total: 1200, setorId: 1 },
  { data: "23 Abr", total: 980, setorId: 1 },
  { data: "7 Mai",  total: 750, setorId: 1 },
  { data: "14 Mai", total: 820, setorId: 1 },
  { data: "22 Mai", total: 900, setorId: 1 },
  { data: "6 Jun",  total: 780, setorId: 1 },
  { data: "13 Jun", total: 850, setorId: 1 },
  { data: "20 Jun", total: 770, setorId: 1 },
  { data: "Abr 2",  total: 580, setorId: 2 },
  { data: "Abr 9",  total: 650, setorId: 2 },
  { data: "15 Abr", total: 780, setorId: 2 },
  { data: "16 Abr", total: 950, setorId: 2 },
  { data: "23 Abr", total: 820, setorId: 2 },
  { data: "7 Mai",  total: 680, setorId: 2 },
  { data: "14 Mai", total: 750, setorId: 2 },
  { data: "22 Mai", total: 830, setorId: 2 },
  { data: "6 Jun",  total: 710, setorId: 2 },
  { data: "13 Jun", total: 780, setorId: 2 },
  { data: "20 Jun", total: 700, setorId: 2 },
];

export const mockProducaoTotal30Dias = [
  { data: "28 Mai", total: 600, setorId: 1 },
  { data: "1 Jun",  total: 720, setorId: 1 },
  { data: "5 Jun",  total: 810, setorId: 1 },
  { data: "10 Jun", total: 750, setorId: 1 },
  { data: "15 Jun", total: 900, setorId: 1 },
  { data: "20 Jun", total: 680, setorId: 1 },
  { data: "25 Jun", total: 790, setorId: 1 },
  { data: "27 Jun", total: 820, setorId: 1 },
  { data: "28 Mai", total: 550, setorId: 2 },
  { data: "1 Jun",  total: 650, setorId: 2 },
  { data: "5 Jun",  total: 740, setorId: 2 },
  { data: "10 Jun", total: 680, setorId: 2 },
  { data: "15 Jun", total: 830, setorId: 2 },
  { data: "20 Jun", total: 610, setorId: 2 },
  { data: "25 Jun", total: 720, setorId: 2 },
  { data: "27 Jun", total: 750, setorId: 2 },
];

export const mockProducaoTotal7Dias = [
  { data: "Seg", total: 750, setorId: 1 },
  { data: "Ter", total: 820, setorId: 1 },
  { data: "Qua", total: 690, setorId: 1 },
  { data: "Qui", total: 910, setorId: 1 },
  { data: "Sex", total: 840, setorId: 1 },
  { data: "Sáb", total: 600, setorId: 1 },
  { data: "Dom", total: 450, setorId: 1 },
  { data: "Seg", total: 680, setorId: 2 },
  { data: "Ter", total: 750, setorId: 2 },
  { data: "Qua", total: 620, setorId: 2 },
  { data: "Qui", total: 840, setorId: 2 },
  { data: "Sex", total: 770, setorId: 2 },
  { data: "Sáb", total: 530, setorId: 2 },
  { data: "Dom", total: 380, setorId: 2 },
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
  { operador: "Marcos",  media: 40, setorId: 1 },
  { operador: "Victória", media: 42, setorId: 1 },
  { operador: "Joana",   media: 22, setorId: 1 },
  { operador: "Andrew",  media: 18, setorId: 1 },
  { operador: "Mauro",   media: 30, setorId: 1 },
  { operador: "Bruna",   media: 35, setorId: 2 },
  { operador: "Ricardo", media: 38, setorId: 2 },
  { operador: "Lina",    media: 28, setorId: 2 },]

export const mockTempoSessaoPerfil = [
{ perfil: "Gestores",   horas: 1.42, label: "01:25 h", setorId: 1 },
  { perfil: "Operadores", horas: 0.50, label: "00:30 h", setorId: 1 },
  { perfil: "Gestores",   horas: 1.30, label: "01:18 h", setorId: 2 },
  { perfil: "Operadores", horas: 0.55, label: "00:33 h", setorId: 2 },
];

export const mockRotatividade = [
  { mes: "Abr", novos: 14, desligados: 6, setorId: 1 },
  { mes: "Mai", novos: 18, desligados: 10, setorId: 1 },
  { mes: "Jun", novos: 25, desligados: 15, setorId: 1 },
  { mes: "Abr", novos: 11, desligados: 4, setorId: 2 },
  { mes: "Mai", novos: 13, desligados: 7, setorId: 2 },
  { mes: "Jun", novos: 19, desligados: 12, setorId: 2 },
];

export const mockUsuariosPorTurno = [
  { turno: "Manhã", value: 28, setorId: 1 },
  { turno: "Tarde", value: 20, setorId: 1 },
  { turno: "Noite", value: 15, setorId: 1 },
  { turno: "Manhã", value: 24, setorId: 2 },
  { turno: "Tarde", value: 18, setorId: 2 },
  { turno: "Noite", value: 12, setorId: 2 },
];

export const mockProducaoMediaUsuarioSetor = [
  { usuario: "Marcos",   media: 56, setorId: 1 },
  { usuario: "Victória", media: 48, setorId: 1 },
  { usuario: "Joana",    media: 40, setorId: 1 },
  { usuario: "Andrew",   media: 34, setorId: 1 },
  { usuario: "Mauro",    media: 29, setorId: 1 },
  { usuario: "Bruna",    media: 52, setorId: 2 },
  { usuario: "Ricardo",  media: 46, setorId: 2 },
  { usuario: "Lina",     media: 33, setorId: 2 },
];

export const mockUsuarioTaxaRefugo = [
  { operador: "Marcos",   taxa: 12, setorId: 1 },
  { operador: "Victória", taxa: 8, setorId: 1 },
  { operador: "Joana",    taxa: 15, setorId: 1 },
  { operador: "Andrew",   taxa: 10, setorId: 1 },
  { operador: "Mauro",    taxa: 20, setorId: 1 },
  { operador: "Bruna",    taxa: 14, setorId: 2 },
  { operador: "Ricardo",  taxa: 11, setorId: 2 },
  { operador: "Lina",     taxa: 18, setorId: 2 },
];
export const mockSetorProducaoDiaria = [
  { hora: "00h", pcs: 8 },
  { hora: "01h", pcs: 6 },
  { hora: "02h", pcs: 5 },
  { hora: "03h", pcs: 4 },
  { hora: "04h", pcs: 3 },
  { hora: "05h", pcs: 5 },
  { hora: "06h", pcs: 18 },
  { hora: "07h", pcs: 34 },
  { hora: "08h", pcs: 52 },
  { hora: "09h", pcs: 68 },
  { hora: "10h", pcs: 74 },
  { hora: "11h", pcs: 88 },
  { hora: "12h", pcs: 102 },
  { hora: "13h", pcs: 117 },
  { hora: "14h", pcs: 132 },
  { hora: "15h", pcs: 148 },
  { hora: "16h", pcs: 145 },
  { hora: "17h", pcs: 138 },
  { hora: "18h", pcs: 122 },
  { hora: "19h", pcs: 107 },
  { hora: "20h", pcs: 89 },
  { hora: "21h", pcs: 72 },
  { hora: "22h", pcs: 58 },
  { hora: "23h", pcs: 40 },
];

export const mockSetorOEEPanel = {
  disponibilidade: 85,
  performance: 90,
  qualidade: 90,
  oee: 72.5,
};

// CumprimentoMetaSetor
export const mockCumprimentoMetaSetor = [
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
  { dia: "Seg", produzindo: 8,  parada: 7  },
  { dia: "Ter", produzindo: 7,  parada: 12 },
  { dia: "Qua", produzindo: 13, parada: 15 },
  { dia: "Sex", produzindo: 9,  parada: 8  },
];

export const mockEficienciaMaquina = [
  {  dia: "Seg", eficiencia: 85 },
  { dia: "Ter", eficiencia: 60 },
  {  dia: "Qua", eficiencia: 72 },
  {  dia: "Qui", eficiencia: 90 },
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

export const mockAndonFactoryStatusMaquinas = {
  emProducao: 12,
  emSetup: 3,
  emParada: 2,
};

export const mockAndonSectorStatusMaquinas = {
  emProducao: 12,
  emSetup:     3,
  emParada:    2,
};
 
export const mockAndonFactoryRanking = [
  { setor: "THAK-909816", produtividade: 95 },
  { setor: "THAK-909823", produtividade: 88 },
  { setor: "THAK-909818", produtividade: 73 },
  { setor: "THAK-909821", produtividade: 61 },
];

export const mockAndonSectorRanking = [
  { setor: "THAK-909816", produtividade: 92 },
  { setor: "THAK-909819", produtividade: 86 },
  { setor: "THAK-909818", produtividade: 74 },
  { setor: "THAK-909817", produtividade: 65 },
];

export const mockAndonFactorySections = [
  {
    id: "engrenagens",
    titulo: "Setor das Engrenagens",
    maquinas: [
      {
        id: "eng-1",
        codigo: "THAK-909816",
        status: "emProducao",
        operador: "Luis Mariz",
        detalheLabel: "Velocidade",
        detalheValor: "200 peças/h",
        metaTurno: "280/500 peças",
        metaDia: "280/1200 peças",
        oee: 88,
        tempoStatus: "Em produção há 1h 35m",
      },
      {
        id: "eng-2",
        codigo: "THAK-909817",
        status: "emParada",
        operador: "Luis Alves",
        detalheLabel: "Motivo",
        detalheValor: "Falta de material",
        metaTurno: "30/600 peças",
        metaDia: "280/1200 peças",
        oee: 42,
        tempoStatus: "Parada há 45m",
      },
      {
        id: "eng-3",
        codigo: "THAK-909818",
        status: "emSetup",
        operador: "Luis Mariz",
        detalheLabel: "Motivo",
        detalheValor: "Troca de molde",
        metaTurno: "80/200 peças",
        metaDia: "80/800 peças",
        oee: 42,
        tempoStatus: "Em setup há 45m",
      },
      {
        id: "eng-4",
        codigo: "THAK-909819",
        status: "emProducao",
        operador: "Luis Mariz",
        detalheLabel: "Velocidade",
        detalheValor: "200 peças/h",
        metaTurno: "280/500 peças",
        metaDia: "280/1200 peças",
        oee: 88,
        tempoStatus: "Em produção há 1h 35m",
      },
    ],
  },
  {
    id: "roscas",
    titulo: "Setor das Roscas",
    maquinas: [
      {
        id: "ros-1",
        codigo: "THAK-909820",
        status: "emProducao",
        operador: "Luis Mariz",
        detalheLabel: "Velocidade",
        detalheValor: "200 peças/h",
        metaTurno: "280/500 peças",
        metaDia: "280/1200 peças",
        oee: 88,
        tempoStatus: "Em produção há 1h 35m",
      },
      {
        id: "ros-2",
        codigo: "THAK-909821",
        status: "emParada",
        operador: "Luis Alves",
        detalheLabel: "Motivo",
        detalheValor: "Falta de material",
        metaTurno: "30/600 peças",
        metaDia: "280/1200 peças",
        oee: 42,
        tempoStatus: "Parada há 45m",
      },
      {
        id: "ros-3",
        codigo: "THAK-909822",
        status: "emSetup",
        operador: "Luis Mariz",
        detalheLabel: "Motivo",
        detalheValor: "Troca de molde",
        metaTurno: "80/200 peças",
        metaDia: "80/800 peças",
        oee: 42,
        tempoStatus: "Em setup há 45m",
      },
      {
        id: "ros-4",
        codigo: "THAK-909823",
        status: "emProducao",
        operador: "Luis Mariz",
        detalheLabel: "Velocidade",
        detalheValor: "200 peças/h",
        metaTurno: "280/500 peças",
        metaDia: "280/1200 peças",
        oee: 88,
        tempoStatus: "Em produção há 1h 35m",
      },
    ],
  },
];

export const mockAndonSectorSections = [
  {
    id: "engrenagens",
    titulo: "Setor das Engrenagens",
    maquinas: [
      {
        id: "eng-1",
        codigo: "THAK-909816",
        status: "emProducao",
        operador: "Luis Mariz",
        detalheLabel: "Velocidade",
        detalheValor: "200 peças/h",
        metaTurno: "280/500 peças",
        metaDia: "280/1200 peças",
        oee: 88,
        tempoStatus: "Em produção há 1h 35m",
      },
      {
        id: "eng-2",
        codigo: "THAK-909817",
        status: "emParada",
        operador: "Luis Alves",
        detalheLabel: "Motivo",
        detalheValor: "Falta de material",
        metaTurno: "30/600 peças",
        metaDia: "280/1200 peças",
        oee: 42,
        tempoStatus: "Parada há 45m",
      },
      {
        id: "eng-3",
        codigo: "THAK-909818",
        status: "emSetup",
        operador: "Luis Mariz",
        detalheLabel: "Motivo",
        detalheValor: "Troca de molde",
        metaTurno: "80/200 peças",
        metaDia: "80/800 peças",
        oee: 42,
        tempoStatus: "Em setup há 45m",
      },
      {
        id: "eng-4",
        codigo: "THAK-909819",
        status: "emProducao",
        operador: "Luis Mariz",
        detalheLabel: "Velocidade",
        detalheValor: "200 peças/h",
        metaTurno: "280/500 peças",
        metaDia: "280/1200 peças",
        oee: 88,
        tempoStatus: "Em produção há 1h 35m",
      },
    ],
  },
];

export const mockMetaKPI = {
  titulo: "Sua Meta", valor: "500", unidade: "peças"
};
export const mockProdutividadeDia = { 
  produzido: 43.5, meta: 56.5 
};
export const mockQualidade = { 
  pecasBoas: 68.8, refugo: 31.2 
};
export const mockVelocimetro = { 
  atual: 50, ideal: 70 
};

export const mockOEEMaquinaOperador = [
  { setor: "Média das máquinas do Setor", oee: 85 },
  { setor: "Minha máquina",              oee: 72 },
];

export const mockOEEMaquinaDetalhes = {
  nome_maquina:    "THAK-909816",
  status:          "Produzindo",
  disponibilidade: 82,
  performance:     76,
  qualidade:       91,
  oee:             57,
};

export const mockAndonStatusMaquinas = mockAndonFactoryStatusMaquinas;

export const mockAndonRanking = mockAndonFactoryRanking;


export const mockProducaoPorMaquinaSetor = [
  { maquina: "THAK-002", qtd: 80 },
  { maquina: "THAK-004", qtd: 60 },
  { maquina: "THAK-005", qtd: 40 },
  { maquina: "THAK-008", qtd: 25 },
];
