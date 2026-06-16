import { apiFetch } from "@/lib/api";

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

const normalizarTipoEvento = (tipo) => (tipo === "Setup" ? "Setup" : "Parada");
const normalizarStatusMaquinaEvento = (status) => (status === "Manutencao" ? "Parada" : status);

const normalizarEvento = (evento) => {
  if (!evento) return null;

  const fim = evento.fim ?? evento.termino;
  const maquinaNome =
    typeof evento.maquina === "object"
      ? evento.maquina?.nome ?? evento.maquina?.serie
      : evento.maquina;
  const statusBase = evento.status_maquina ?? evento.status_atual;
  const tipo = normalizarTipoEvento(evento.tipo ?? statusBase);
  const statusMaquina = normalizarStatusMaquinaEvento(statusBase ?? tipo);

  return {
    ...evento,
    id: evento.id ?? evento.id_evento,
    numero_evento: evento.numero_evento ?? evento.numero_evento_empresa ?? evento.numero_evento_maquina ?? evento.id ?? evento.id_evento,
    numero_evento_empresa: evento.numero_evento_empresa ?? evento.numero_evento,
    numero_evento_maquina: evento.numero_evento_maquina ?? evento.numero_evento,
    tipo,
    status: normalizarStatusMaquinaEvento(evento.status ?? tipo),
    status_maquina: statusMaquina,
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

  async getAllPages(limite = 100) {
    const primeiraPagina = await this.getAll(1, limite);
    const totalPaginas = Number(primeiraPagina?.meta?.totalPaginas) || 1;
    const dados = [...(primeiraPagina?.dados ?? [])];

    if (totalPaginas > 1) {
      const paginasRestantes = await Promise.all(
        Array.from({ length: totalPaginas - 1 }, (_, index) => this.getAll(index + 2, limite))
      );

      for (const pagina of paginasRestantes) {
        dados.push(...(pagina?.dados ?? []));
      }
    }

    const idsVistos = new Set();
    return dados.filter((evento) => {
      const id = evento?.id ?? evento?.id_evento;
      if (!id) return true;
      if (idsVistos.has(id)) return false;
      idsVistos.add(id);
      return true;
    });
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
    const idEvento = dados.id_evento ?? dados.id;
    const payload = {
      id_evento: idEvento,
      id_maquina: dados.id_maquina,
      id_motivo_parada: dados.id_motivo_parada,
      observacao: dados.observacao ?? "",
    };

    const response = await apiFetch(`${API_URL}/justificar`, {
      method: "POST",
      body: JSON.stringify(payload),
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
