//ISSO AQUI É UM EXEMPLO DE COMO PEGAR O USUÁRIO DO TOKEN JWT
//PASSIVEL DE MUDANÇAS
//PESSOAL DO BACK OLHEM AQUI
export function getUserFromToken() {
  // Verifica se o código está rodando no navegador (client-side)
  if (typeof window === "undefined") return null;
  const token = localStorage.getItem("token");
  if (!token) return null;
  const payload = JSON.parse(atob(token.split(".")[1]));
  return {
    id_usuario: payload.id_usuario,
    id_empresa: payload.id_empresa,
    tipo: payload.tipo
  };
}