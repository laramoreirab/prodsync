// src/services/api.js
//aqui se faz o fetch para TUDO. Ele montta a url variável de ambiente, e tem um tratamento de erro genérico(lança erro se a resposta não for OK).
const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export async function apiFetch(path, options = {}) {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API ${response.status}: ${path}`);
  }

  return response.json();
}