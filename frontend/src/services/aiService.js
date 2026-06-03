import { apiFetch } from "@/lib/api";

export async function enviarMensagemChat(mensagem, historico = []) {
  try {
    const resposta = await apiFetch("/api/ai/chat", {
      method: "POST",
      body: JSON.stringify({ mensagem, historico }),
    });
    return resposta;
  } catch (error) {
    console.error("Erro ao enviar mensagem para IA:", error);
    throw error;
  }
}
