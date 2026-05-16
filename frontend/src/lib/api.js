const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function apiFetch(rota, opcoes = {}) {
  const token = localStorage.getItem("token");

  const headers = {
    Authorization: `Bearer ${token}`,
    ...opcoes.headers,
  };

  if (!(opcoes.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(`${API_URL}${rota}`, {
    ...opcoes,
    headers,
  });

  if (res.status === 401) {
    localStorage.removeItem("token");
    window.location.href = "/";
    return;
  }

  if (!res.ok) {
    const erroDados = await res.json().catch(() => ({}));
    const detalhes = Array.isArray(erroDados.detalhes)
      ? erroDados.detalhes.map((item) => `${item.campo}: ${item.mensagem}`).join("; ")
      : null;

    throw new Error(
      erroDados.message ||
      erroDados.mensagem ||
      detalhes ||
      erroDados.erro ||
      "Erro na requisicao"
    );
  }

  return await res.json();
}
