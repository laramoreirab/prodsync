import { apiFetch } from "@/lib/api";

const API_URL = "/api/ordens";

const prioridadeParaBackend = {
  "Crítica": "Critica",
  "Critica": "Critica",
  "Média": "Media",
  "Media": "Media",
  Alta: "Alta",
  Baixa: "Baixa",
};

const prioridadeParaTela = {
  Critica: "Crítica",
  Media: "Média",
  Alta: "Alta",
  Baixa: "Baixa",
};

const statusParaTela = {
  Em_Andamento: "Produzindo",
  Parada: "Parada",
  Setup: "Setup",
  Finalizada: "Concluída",
};

const extrairDados = (response) => response?.dados ?? response;

/** Percentual 0–100 a partir de peças boas apontadas e meta planejada. */
const calcularProgressoOP = (produzido, planejado, progressoInformado) => {
  const produzidoNum = Number(produzido) || 0;
  const planejadoNum = Number(planejado) || 0;

  if (planejadoNum > 0) {
    return Math.min(100, Math.round((produzidoNum / planejadoNum) * 100));
  }

  const informado = Number(progressoInformado);
  return Number.isFinite(informado) ? Math.min(100, Math.max(0, informado)) : 0;
};

const normalizarPayload = (dados) => {
  const payload = {
    ...dados,
    prioridade: prioridadeParaBackend[dados.prioridade] ?? dados.prioridade,
  };

  if (dados.id_setor !== undefined && dados.id_setor !== "") payload.id_setor = Number(dados.id_setor);
  if (dados.id_maquina !== undefined && dados.id_maquina !== "") payload.id_maquina = Number(dados.id_maquina);
  if (dados.qtd_planejada !== undefined && dados.qtd_planejada !== "") payload.qtd_planejada = Number(dados.qtd_planejada);

  return payload;
};

const normalizarOp = (op) => {
  if (!op) return op;

  const produzido = Number(op.produzido ?? op.qtd_produzida ?? 0);
  const planejado = Number(op.qtd_planejada) || 0;
  const progresso = calcularProgressoOP(produzido, planejado, op.progresso);

  const setor = op.maquina?.setor ?? op.setor;

  return {
    ...op,
    id: op.id ?? op.id_ordem,
    id_maquina: op.id_maquina ?? op.maquina?.id_maquina ?? null,
    nome: op.nome ?? op.codigo_lote ?? op.produto,
    setor: typeof setor === "string" ? setor : setor?.nome_setor ?? op.id_setor,
    id_setor: op.id_setor ?? setor?.id_setor ?? null,
    prioridade: prioridadeParaTela[op.prioridade] ?? op.prioridade,
    status_op: statusParaTela[op.status_op] ?? op.status_op,
    produzido,
    progresso,
    data_inicio: op.data_inicio ?? null,
    data_fim: op.data_fim ?? null,
    data_hora_inicio: op.data_inicio ?? op.data_hora_inicio ?? null,
    data_hora_fim: op.data_fim ?? op.data_hora_fim ?? null,
  };
};

const normalizarRespostaLista = (response) => ({
  ...response,
  dados: (response?.dados ?? []).map(normalizarOp),
});

export const opCrudService = {
  getAll: async () => {
    const response = await apiFetch(`${API_URL}?pagina=1&limite=100`);
    return normalizarRespostaLista(response);
  },

  getById: async (id) => {
    const response = await apiFetch(`${API_URL}/${id}`);
    return normalizarOp(extrairDados(response));
  },

  create: async (dados) => {
    const response = await apiFetch(API_URL, {
      method: "POST",
      body: JSON.stringify(normalizarPayload(dados)),
    });
    return normalizarOp(extrairDados(response));
  },

  update: async (id, dados) => {
    const response = await apiFetch(`${API_URL}/${id}`, {
      method: "PUT",
      body: JSON.stringify(normalizarPayload(dados)),
    });
    return normalizarOp(extrairDados(response));
  },

  delete: async (id) => {
    await apiFetch(`${API_URL}/${id}`, { method: "DELETE" });
    return true;
  },

  getHistoricoEventos: async (id) => {
    const response = await apiFetch(`${API_URL}/${id}/historico-eventos`);
    return response?.dados ?? [];
  },

  getApontamentos: async (id) => {
    const response = await apiFetch(`${API_URL}/${id}/apontamentos`);
    return response?.dados ?? [];
  },
};
