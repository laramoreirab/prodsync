const API_URL = process.env.NEXT_PUBLIC_API_URL

export async function apiFetch(rota, opcoes = {}) {

  const token = localStorage.getItem("token")

  const res = await fetch(`${API_URL}${rota}`, {
    ...opcoes,
    headers: {
      "Content-Type":  "application/json",
      "Authorization": `Bearer ${token}`,
      ...opcoes.headers
    }
  })

  // token expirado — manda pro login
  if (res.status === 401) {
    localStorage.removeItem("token")
    window.location.href = "/"
    return
  }

  if (!res.ok) {
    const erroDados = await res.json().catch(() => ({}));
    throw new Error(erroDados.message || "Erro na requisição");
  }

  return await res.json();
}

//o que deve ter em toda página que fará um fetch 

// import { apiFetch } from "@/lib/api"

// // exemplo para GET
// const res  = await apiFetch("/api/funcionarios")
// const data = await res.json()

// // exemplo para POST
// const res = await apiFetch("/api/funcionarios", {
//   method: "POST",
//   body:   JSON.stringify({ nome, cargo })
// })