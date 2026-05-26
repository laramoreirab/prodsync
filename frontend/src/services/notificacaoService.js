import { apiFetch } from "@/lib/api";

const API_URL = "/api/notificacoes";

export const notificacaoService = {
  async listar({ apenasNaoLidas = false, limite = 20 } = {}) {
    const params = new URLSearchParams();
    if (apenasNaoLidas) params.set("nao_lidas", "true");
    if (limite) params.set("limite", String(limite));

    const query = params.toString();
    const resposta = await apiFetch(`${API_URL}${query ? `?${query}` : ""}`);
    return resposta?.dados ?? [];
  },

  async contarNaoLidas() {
    const resposta = await apiFetch(`${API_URL}/contagem`);
    return resposta?.dados?.total ?? 0;
  },

  async marcarComoLida(id) {
    const resposta = await apiFetch(`${API_URL}/${id}/lida`, { method: "PATCH" });
    return resposta?.dados;
  },

  async marcarTodasComoLidas() {
    return apiFetch(`${API_URL}/marcar-todas-lidas`, { method: "PATCH" });
  },

  async excluir(id) {
    return apiFetch(`${API_URL}/${id}`, { method: "DELETE" });
  },

  async solicitarJustificativa(id_evento) {
    const resposta = await apiFetch(`${API_URL}/solicitar-justificativa`, {
      method: "POST",
      body: JSON.stringify({ id_evento }),
    });
    return resposta;
  },
};
