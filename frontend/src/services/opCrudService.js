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

  const produzido = op.produzido ?? op.qtd_produzida ?? 0;
  const planejado = Number(op.qtd_planejada) || 0;
  const progressoNumero = planejado > 0 ? Math.round((produzido / planejado) * 100) : 0;

  return {
    ...op,
    id: op.id ?? op.id_ordem,
    nome: op.nome ?? op.codigo_lote ?? op.produto,
    setor: op.setor ?? op.maquina?.setor?.nome_setor ?? op.id_setor,
    prioridade: prioridadeParaTela[op.prioridade] ?? op.prioridade,
    status_op: statusParaTela[op.status_op] ?? op.status_op,
    progresso: op.progresso ?? progressoNumero,
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
};
