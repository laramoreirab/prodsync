/** Seções disponíveis por variante de relatório (adm = empresa, gestor = setor). */

export const RELATORIO_VARIANTS = {
  adm: {
    titulo: "Relatório da Empresa",
    subtitulo: "Personalize e exporte o dashboard geral em PDF",
    storageKey: "prodsync-relatorio-selecao-adm",
    areas: [
      {
        id: "empresa",
        titulo: "Informações da empresa",
        descricao: "Dados cadastrais e panorama dos setores",
        secoes: [
          { id: "empresa-info", label: "Dados da empresa" },
          { id: "setores-resumo", label: "Resumo por setores" },
          { id: "eventos-maquinas", label: "Últimos eventos das máquinas", hasPeriodo: true },
        ],
      },
      {
        id: "producao",
        titulo: "Produção e OEE",
        descricao: "Indicadores principais de produção",
        secoes: [
          { id: "producao-dia", label: "Produção do dia" },
          { id: "oee", label: "OEE geral" },
          { id: "producao-setor", label: "Produção por setor" },
        ],
      },
      {
        id: "maquinas",
        titulo: "Máquinas",
        descricao: "Status e utilização dos ativos",
        secoes: [
          { id: "maquina-status", label: "Status das máquinas" },
        ],
      },
      {
        id: "qualidade",
        titulo: "Qualidade e paradas",
        descricao: "Refugo e motivos de parada",
        secoes: [
          { id: "tendencia-refugo", label: "Tendência de refugo" },
          { id: "motivos-paradas", label: "Motivos frequentes de parada" },
        ],
      },
      {
        id: "kpi",
        titulo: "Indicadores rápidos",
        descricao: "KPIs consolidados do dashboard",
        secoes: [
          { id: "kpi-paradas", label: "Média de paradas por dia" },
          { id: "kpi-pecas-min", label: "Peças por minuto" },
          { id: "kpi-maquina-turno", label: "Máquina ativa por turno" },
          { id: "kpi-producao-turno", label: "Produção por turno e lotes" },
        ],
      },
    ],
  },
  gestor: {
    titulo: "Relatório do Setor",
    subtitulo: "Personalize e exporte o dashboard do seu setor em PDF",
    storageKey: "prodsync-relatorio-selecao-gestor",
    areas: [
      {
        id: "contexto",
        titulo: "Contexto",
        descricao: "Identificação do setor e empresa",
        secoes: [
          { id: "empresa-info", label: "Empresa e setor" },
          { id: "eventos-maquinas", label: "Últimos eventos das máquinas", hasPeriodo: true },
        ],
      },
      {
        id: "panorama",
        titulo: "Panorama do setor",
        secoes: [
          { id: "producao-diaria", label: "Produção diária do setor" },
          { id: "oee-medio", label: "OEE médio do setor" },
        ],
      },
      {
        id: "eficiencia",
        titulo: "Eficiência e equipe",
        secoes: [
          { id: "oee-evolucao", label: "Evolução do OEE" },
          { id: "top-operadores", label: "Top operadores" },
        ],
      },
      {
        id: "ativos",
        titulo: "Ativos de produção",
        secoes: [
          { id: "producao-maquina", label: "Produção por máquina" },
          { id: "status-donut", label: "Status das máquinas" },
        ],
      },
      {
        id: "perdas",
        titulo: "Perdas e qualidade",
        secoes: [
          { id: "motivos-parada-setor", label: "Motivos de parada" },
          { id: "tendencia-refugo", label: "Tendência de refugo" },
        ],
      },
      {
        id: "kpi",
        titulo: "Indicadores rápidos",
        secoes: [
          { id: "kpi-paradas", label: "Média de paradas por dia" },
          { id: "kpi-pecas-min", label: "Peças por minuto" },
          { id: "kpi-maquina-turno", label: "Máquina ativa por turno" },
          { id: "kpi-producao-turno", label: "Produção por turno e lotes" },
        ],
      },
    ],
  },
};

export function obterTodosIdsSecao(variant) {
  const config = RELATORIO_VARIANTS[variant];
  if (!config) return [];
  return config.areas.flatMap((area) => area.secoes.map((s) => s.id));
}

export function criarSelecaoPadrao(variant) {
  return Object.fromEntries(obterTodosIdsSecao(variant).map((id) => [id, true]));
}

export const PERIODO_EVENTOS_STORAGE = {
  adm: "prodsync-relatorio-periodo-adm",
  gestor: "prodsync-relatorio-periodo-gestor",
};
