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
 
export const mockAndonRanking = [
  { setor: "THAK-9879", produtividade: 95 },
  { setor: "THAK-9878", produtividade: 80 },
  { setor: "THAK-9877", produtividade: 70 },
  { setor: "THAK-9876", produtividade: 55 },
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

export const mockProducaoPorMaquinaSetor = [
  { setor: "THAK-002", qtd: 80 },
  { setor: "THAK-004", qtd: 60 },
  { setor: "THAK-005", qtd: 40 },
  { setor: "THAK-008", qtd: 25 },
];

// Dados adicionais para deixar os dashboards mockados mais completos.
mockProducaoPorSetor.push(
  { setor: "Usinagem", qtd: 285 },
  { setor: "Montagem", qtd: 260 },
  { setor: "Soldagem", qtd: 198 },
  { setor: "Embalagens", qtd: 172 }
);

mockProducaoPorHora.push(
  { hora: "07h", pcs: 58 },
  { hora: "09h", pcs: 80 },
  { hora: "11h", pcs: 76 },
  { hora: "13h", pcs: 70 },
  { hora: "15h", pcs: 91 },
  { hora: "17h", pcs: 74 }
);

mockMotivosFrequentesParadas.push(
  { motivo: "Troca de Ferramenta", qtd: 38 },
  { motivo: "Ajuste de Parametros", qtd: 32 },
  { motivo: "Setup de Linha", qtd: 27 }
);

mockSetores.push(
  { id: 10, setor: "Usinagem", gestor: "Marina Lopes", oeeMedio: 84, qtdMaquinas: 24, qtdOperadores: 22 },
  { id: 11, setor: "Corte CNC", gestor: "Andre Martins", oeeMedio: 62, qtdMaquinas: 16, qtdOperadores: 14 },
  { id: 12, setor: "Pintura", gestor: "Bruna Tavares", oeeMedio: 71, qtdMaquinas: 11, qtdOperadores: 13 }
);

mockRefugoPorSetor.push(
  { setor: "Montagem", refugo: 45 },
  { setor: "Soldagem", refugo: 52 },
  { setor: "Pintura", refugo: 38 }
);

mockTopMotivosTempo.push(
  { motivo: "Troca de Ferramenta", tempo: "38m", minutos: 38 },
  { motivo: "Ajuste de Parametros", tempo: "32m", minutos: 32 }
);

mockQtdUsuariosPorSetor.push(
  { setor: "Usinagem", qtd: 48 },
  { setor: "Montagem", qtd: 42 },
  { setor: "Soldagem", qtd: 31 },
  { setor: "Embalagens", qtd: 26 }
);

mockTopOperadores.push(
  { setor: "Camila", media: 46 },
  { setor: "Rafael", media: 37 },
  { setor: "Bianca", media: 34 }
);

mockRotatividade.unshift(
  { mes: "Jan", novos: 10, desligados: 4 },
  { mes: "Fev", novos: 12, desligados: 5 },
  { mes: "Mar", novos: 16, desligados: 8 }
);
mockRotatividade.push(
  { mes: "Jul", novos: 21, desligados: 9 },
  { mes: "Ago", novos: 19, desligados: 7 }
);

mockOPTopRefugo.push(
  { op: "#4521 (Valv)", refugo: 22 },
  { op: "#4534 (Turb)", refugo: 18 },
  { op: "#4540 (Ros)", refugo: 11 }
);

mockOPCargaSetor.push(
  { setor: "Soldagem", carga: 6 },
  { setor: "Pintura", carga: 3 },
  { setor: "Embalagens", carga: 5 }
);

mockPecasPorDia.push({ dia: "Dom", qtd: 38 });

mockEficienciaMaquina.push(
  { dia: "Sex", eficiencia: 78 },
  { dia: "Sab", eficiencia: 66 },
  { dia: "Dom", eficiencia: 52 }
);

mockSetorTopOperadores.push(
  { operador: "Camila", qtd: 74 },
  { operador: "Rafael", qtd: 68 },
  { operador: "Bianca", qtd: 56 }
);

mockSetorMotivosParada.push(
  { motivo: "Troca de Ferramenta", qtd: 24 },
  { motivo: "Ajuste de Parametros", qtd: 19 }
);

Object.assign(mockAndonFactoryStatusMaquinas, {
  emProducao: 24,
  emSetup: 6,
  emParada: 4,
});

export const mockAndonFactoryRanking = [
  { setor: "Engrenagens", produtividade: 95 },
  { setor: "Usinagem", produtividade: 89 },
  { setor: "Montagem", produtividade: 84 },
  { setor: "Soldagem", produtividade: 78 },
  { setor: "Pintura", produtividade: 72 },
  { setor: "Embalagens", produtividade: 68 },
];

export const mockAndonSectorRanking = [
  { setor: "THAK-9879", produtividade: 95 },
  { setor: "THAK-9878", produtividade: 80 },
  { setor: "THAK-9877", produtividade: 70 },
  { setor: "THAK-9876", produtividade: 55 },
  { setor: "THAK-9875", produtividade: 49 },
];

export const mockAndonFactorySections = [
  {
    id: "usinagem",
    titulo: "Usinagem",
    maquinas: [
      { id: "m-001", codigo: "THAK-9879", status: "emProducao", operador: "Marcos Lima", detalheLabel: "OP atual", detalheValor: "OP-4491", metaTurno: "420 pcs", metaDia: "1.260 pcs", oee: 91, tempoStatus: "02h 15m" },
      { id: "m-002", codigo: "THAK-9878", status: "emSetup", operador: "Camila Rocha", detalheLabel: "Setup", detalheValor: "Troca de ferramenta", metaTurno: "360 pcs", metaDia: "1.080 pcs", oee: 64, tempoStatus: "00h 42m" },
      { id: "m-003", codigo: "THAK-9877", status: "emParada", operador: "Rafael Souza", detalheLabel: "Motivo", detalheValor: "Falta de material", metaTurno: "390 pcs", metaDia: "1.170 pcs", oee: 38, tempoStatus: "01h 08m" },
    ],
  },
  {
    id: "montagem",
    titulo: "Montagem",
    maquinas: [
      { id: "m-004", codigo: "THAK-9821", status: "emProducao", operador: "Bianca Alves", detalheLabel: "OP atual", detalheValor: "OP-4521", metaTurno: "510 pcs", metaDia: "1.530 pcs", oee: 88, tempoStatus: "03h 04m" },
      { id: "m-005", codigo: "THAK-9822", status: "emProducao", operador: "Joana Costa", detalheLabel: "OP atual", detalheValor: "OP-4534", metaTurno: "480 pcs", metaDia: "1.440 pcs", oee: 82, tempoStatus: "01h 55m" },
      { id: "m-006", codigo: "THAK-9823", status: "emSetup", operador: "Antonio Reis", detalheLabel: "Setup", detalheValor: "Ajuste de gabarito", metaTurno: "450 pcs", metaDia: "1.350 pcs", oee: 59, tempoStatus: "00h 31m" },
    ],
  },
  {
    id: "soldagem",
    titulo: "Soldagem",
    maquinas: [
      { id: "m-007", codigo: "THAK-9760", status: "emProducao", operador: "Maria Nunes", detalheLabel: "OP atual", detalheValor: "OP-4540", metaTurno: "300 pcs", metaDia: "900 pcs", oee: 76, tempoStatus: "02h 44m" },
      { id: "m-008", codigo: "THAK-9761", status: "emParada", operador: "Mauro Pinto", detalheLabel: "Motivo", detalheValor: "Manutencao corretiva", metaTurno: "320 pcs", metaDia: "960 pcs", oee: 41, tempoStatus: "00h 56m" },
    ],
  },
];

export const mockAndonSectorSections = [
  {
    id: "linha-a",
    titulo: "Linha A",
    maquinas: [
      { id: "s-001", codigo: "THAK-9879", status: "emProducao", operador: "Marcos Lima", detalheLabel: "OP atual", detalheValor: "OP-4491", metaTurno: "420 pcs", metaDia: "1.260 pcs", oee: 91, tempoStatus: "02h 15m" },
      { id: "s-002", codigo: "THAK-9878", status: "emSetup", operador: "Camila Rocha", detalheLabel: "Setup", detalheValor: "Troca de ferramenta", metaTurno: "360 pcs", metaDia: "1.080 pcs", oee: 64, tempoStatus: "00h 42m" },
      { id: "s-003", codigo: "THAK-9877", status: "emProducao", operador: "Rafael Souza", detalheLabel: "OP atual", detalheValor: "OP-4521", metaTurno: "390 pcs", metaDia: "1.170 pcs", oee: 78, tempoStatus: "01h 08m" },
    ],
  },
  {
    id: "linha-b",
    titulo: "Linha B",
    maquinas: [
      { id: "s-004", codigo: "THAK-9876", status: "emParada", operador: "Bianca Alves", detalheLabel: "Motivo", detalheValor: "Falta de material", metaTurno: "330 pcs", metaDia: "990 pcs", oee: 35, tempoStatus: "01h 18m" },
      { id: "s-005", codigo: "THAK-9875", status: "emProducao", operador: "Joana Costa", detalheLabel: "OP atual", detalheValor: "OP-4534", metaTurno: "370 pcs", metaDia: "1.110 pcs", oee: 74, tempoStatus: "02h 01m" },
    ],
  },
];
