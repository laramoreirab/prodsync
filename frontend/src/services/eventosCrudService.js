import { apiFetch } from "@/lib/api";
import { eventosMockService } from "@/mocks/eventosMock";

const USE_MOCK = false;
const API_URL = "/api/eventos";

const extrairDados = (resposta) => resposta?.dados ?? resposta ?? [];

const formatarDuracao = (inicio, fim, duracaoMinutos) => {
  if (typeof duracaoMinutos === "string" && duracaoMinutos.includes(":")) {
    return duracaoMinutos;
  }

  const duracaoNumero = Number(duracaoMinutos);
  if (Number.isFinite(duracaoNumero)) {
    const horas = Math.floor(duracaoNumero / 60);
    const minutos = duracaoNumero % 60;
    return `${String(horas).padStart(2, "0")}:${String(minutos).padStart(2, "0")}`;
  }

  if (!inicio) return "-";

  const totalMinutos = Math.max(
    0,
    Math.round((new Date(fim ?? Date.now()) - new Date(inicio)) / 1000 / 60)
  );
  const horas = Math.floor(totalMinutos / 60);
  const minutos = totalMinutos % 60;
  return `${String(horas).padStart(2, "0")}:${String(minutos).padStart(2, "0")}`;
};

const formatarDataEvento = (inicio, fim) => {
  if (!inicio) return "-";

  const dataInicio = new Date(inicio);
  const dataFim = fim ? new Date(fim) : null;
  const data = dataInicio.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
  const horaInicio = dataInicio.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  const horaFim = dataFim
    ? dataFim.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
    : "Ativo";

  return `${data} (${horaInicio} - ${horaFim})`;
};

const normalizarEvento = (evento) => {
  if (!evento) return null;

  const fim = evento.fim ?? evento.termino;
  const maquinaNome =
    typeof evento.maquina === "object"
      ? evento.maquina?.nome ?? evento.maquina?.serie
      : evento.maquina;
  const tipo = evento.tipo ?? (evento.status_atual === "Setup" ? "Setup" : "Parada");

  return {
    ...evento,
    id: evento.id ?? evento.id_evento,
    tipo,
    status: evento.status ?? tipo,
    status_maquina: evento.status_maquina ?? evento.status_atual,
    maquina: evento.maquina ?? maquinaNome ?? "-",
    maquina_nome: maquinaNome ?? "-",
    nome: evento.nome ?? maquinaNome ?? "-",
    inicio: evento.inicio,
    fim,
    motivo: evento.motivo ?? evento.motivo_parada?.descricao ?? "Aguardando Justificativa",
    observacao: evento.observacao || "-",
    data: evento.data ?? formatarDataEvento(evento.inicio, fim),
    duracao: evento.duracao_formatada ?? formatarDuracao(evento.inicio, fim, evento.duracao),
    justificada: Boolean(evento.justificada ?? evento.id_motivo_parada),
  };
};

const normalizarListaResposta = (resposta) => {
  const dados = extrairDados(resposta);
  const lista = Array.isArray(dados) ? dados.map(normalizarEvento) : [];

  if (Array.isArray(resposta)) return lista;

  return {
    ...resposta,
    dados: lista,
  };
};

const apiService = {
  async getAll(pagina = 1, limite = 50) {
    const response = await apiFetch(`${API_URL}?pagina=${pagina}&limite=${limite}`);
    return normalizarListaResposta(response);
  },

  async getById(id) {
    const response = await apiFetch(`${API_URL}/${id}`);
    return normalizarEvento(extrairDados(response));
  },

  async getJustificados(pagina = 1, limite = 50) {
    const response = await apiFetch(`${API_URL}/justificadas?pagina=${pagina}&limite=${limite}`);
    return normalizarListaResposta(response);
  },

  async getNaoJustificados(pagina = 1, limite = 50) {
    const response = await apiFetch(`${API_URL}/nao-justificadas?pagina=${pagina}&limite=${limite}`);
    return normalizarListaResposta(response);
  },

  async create(dados) {
    const response = await apiFetch(`${API_URL}/sistema`, {
      method: "POST",
      body: JSON.stringify(dados),
    });
    return extrairDados(response);
  },

  async update(id, dados) {
    const response = await apiFetch(`${API_URL}/${id}`, {
      method: "PUT",
      body: JSON.stringify(dados),
    });
    return normalizarEvento(extrairDados(response));
  },

  async justificar(dados) {
    const response = await apiFetch(`${API_URL}/justificar`, {
      method: "POST",
      body: JSON.stringify(dados),
    });
    return normalizarEvento(extrairDados(response));
  },

  async getEventoPendente() {
    const response = await apiFetch(`${API_URL}/pendente`);
    return normalizarEvento(extrairDados(response));
  },

  async getMotivos() {
    const response = await apiFetch(`${API_URL}/motivos-parada`);
    return extrairDados(response);
  },
};

export const eventosCrudService = apiService;
