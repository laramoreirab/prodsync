import { apiFetch } from "@/lib/api";
import { eventosMockService } from "@/mocks/eventosMock";

const USE_MOCK = false;
const API_URL = "/api/eventos";

const extrairDados = (resposta) => resposta?.dados ?? resposta ?? [];

const formatarDuracao = (inicio, fim, duracaoMinutos) => {
  if (duracaoMinutos !== null && duracaoMinutos !== undefined) {
    const horas = Math.floor(Number(duracaoMinutos) / 60);
    const minutos = Number(duracaoMinutos) % 60;
    return `${String(horas).padStart(2, "0")}:${String(minutos).padStart(2, "0")}`;
  }

  if (!inicio) return "-";

  const totalMinutos = Math.max(0, Math.round((new Date(fim ?? Date.now()) - new Date(inicio)) / 1000 / 60));
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

  return {
    ...evento,
    id: evento.id ?? evento.id_evento,
    tipo: evento.tipo ?? evento.status_atual,
    status_maquina: evento.status_maquina ?? evento.status_atual,
    maquina: evento.maquina,
    maquina_nome: evento.maquina?.nome ?? evento.maquina?.serie ?? evento.maquina ?? "-",
    inicio: evento.inicio,
    fim,
    motivo: evento.motivo ?? evento.motivo_parada?.descricao ?? "Aguardando Justificativa",
    observacao: evento.observacao || "-",
    data: evento.data ?? formatarDataEvento(evento.inicio, fim),
    duracao: evento.duracao_formatada ?? formatarDuracao(evento.inicio, fim, evento.duracao),
    justificada: Boolean(evento.justificada ?? evento.id_motivo_parada),
  };
};

const apiService = {
  async getAll() {
    const response = await apiFetch(API_URL);
    return extrairDados(response).map(normalizarEvento);
  },

  async getById(id) {
    const response = await apiFetch(`${API_URL}/${id}`);
    return normalizarEvento(extrairDados(response));
  },

  async getJustificados() {
    const response = await apiFetch(`${API_URL}/justificadas`);
    return extrairDados(response).map(normalizarEvento);
  },

  async getNaoJustificados() {
    const response = await apiFetch(`${API_URL}/nao-justificadas`);
    return extrairDados(response).map(normalizarEvento);
  },

  async create(dados) {
    const response = await apiFetch(`${API_URL}/sistema`, {
      method: "POST",
      body: JSON.stringify(dados),
    });
    return extrairDados(response);
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

export const eventosCrudService = USE_MOCK ? eventosMockService : apiService;
