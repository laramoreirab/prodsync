import { apiFetch } from "@/lib/api";

export async function obterPerfil() {
  const resposta = await apiFetch("/api/auth/perfil");
  return resposta?.dados ?? null;
}
