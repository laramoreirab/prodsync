import { apiFetch } from "@/lib/api";
import { getPageContext } from "@/lib/pageContext";

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

export async function analisarArquivoIA(arquivos, prompt = "") {
  try {
    const contextoPagina = getPageContext();
    const formData = new FormData();

    // adiciona todos os arquivos ao formdata
    arquivos.forEach(arquivo => {
      formData.append("files", arquivo);
    });

    if (prompt) {
      formData.append("prompt", prompt);
    }
    formData.append("contexto", JSON.stringify(contextoPagina));

    const resposta = await apiFetch("/api/ai/analisar-arquivo", {
      method: "POST",
      body: formData,
    });
    return resposta;
  } catch (error) {
    console.error("Erro ao analisar arquivos com IA:", error);
    throw error;
  }
}
