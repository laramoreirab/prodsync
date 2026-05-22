const TOKEN_KEY = "token";
const LEGACY_TYPE_KEY = "tipo";

const HOME_BY_USER_TYPE = {
  Adm: "/adm",
  Gestor: "/gestor",
  Operador: "/operador",
};

export function getAuthToken() {
  if (typeof window === "undefined") return null;

  return (
    window.localStorage.getItem(TOKEN_KEY) ||
    window.sessionStorage.getItem(TOKEN_KEY)
  );
}

export function setAuthToken(token, remember = false) {
  if (typeof window === "undefined") return;

  clearAuthToken();

  const storage = remember ? window.localStorage : window.sessionStorage;
  storage.setItem(TOKEN_KEY, token);
}

export function clearAuthToken() {
  if (typeof window === "undefined") return;

  window.localStorage.removeItem(TOKEN_KEY);
  window.sessionStorage.removeItem(TOKEN_KEY);
}

export function clearAuthSession() {
  if (typeof window === "undefined") return;

  clearAuthToken();
  window.localStorage.removeItem(LEGACY_TYPE_KEY);
  window.sessionStorage.removeItem(LEGACY_TYPE_KEY);
}

export function getHomePathByUserType(tipo) {
  return HOME_BY_USER_TYPE[tipo] ?? null;
}

//ISSO AQUI E UM EXEMPLO DE COMO PEGAR O USUARIO DO TOKEN JWT
//PASSIVEL DE MUDANCAS
//PESSOAL DO BACK OLHEM AQUI
export function getUserFromToken() {
  if (typeof window === "undefined") return null;

  const token = getAuthToken();
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));

    if (payload.exp && payload.exp * 1000 <= Date.now()) {
      clearAuthSession();
      return null;
    }

    return {
      id_usuario: payload.id_usuario,
      id_empresa: payload.id_empresa,
      tipo: payload.tipo,
      id_setor: payload.id_setor ?? payload.idSetor ?? null,
    };
  } catch {
    return null;
  }
}
