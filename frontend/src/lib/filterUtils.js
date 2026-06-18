/** Converte duração de evento para minutos (usa inicio/fim ou string HH:MM). */
export function duracaoEmMinutos(evento) {
  if (evento?.inicio) {
    const fim = evento.fim ? new Date(evento.fim) : new Date();
    const diff = Math.max(0, fim - new Date(evento.inicio));
    return Math.floor(diff / 60000);
  }
  if (!evento?.duracao) return 0;
  const partes = String(evento.duracao).split(":").map(Number);
  const [h = 0, m = 0] = partes;
  return h * 60 + m;
}

/** Converte valor do input type="time" (HH:MM) para minutos. */
export function timeInputParaMinutos(valor) {
  if (!valor) return null;
  const [h, m] = String(valor).split(":").map(Number);
  return h * 60 + m;
}

export function filtrarPorCheckbox(lista, campo, valores) {
  if (!valores?.length) return lista;
  return lista.filter((item) => valores.includes(item[campo]));
}

export function filtrarPorDataInicio(lista, intervalo, campoData = "inicio") {
  let filtrados = [...lista];
  if (intervalo?.start) {
    const inicio = new Date(intervalo.start);
    filtrados = filtrados.filter((item) => new Date(item[campoData] ?? item.data) >= inicio);
  }
  if (intervalo?.end) {
    const fim = new Date(intervalo.end);
    filtrados = filtrados.filter((item) => new Date(item[campoData] ?? item.data) <= fim);
  }
  return filtrados;
}

export function filtrarPorNumberRange(lista, campo, range) {
  if (!range) return lista;
  const min = range.min !== "" && range.min != null ? Number(range.min) : null;
  const max = range.max !== "" && range.max != null ? Number(range.max) : null;
  if (min == null && max == null) return lista;

  return lista.filter((item) => {
    const valor = Number(String(item[campo]).replace("%", "")) || 0;
    if (min != null && valor < min) return false;
    if (max != null && valor > max) return false;
    return true;
  });
}

export function filtrarPorDuracaoMax(lista, duracaoMax) {
  const maxMinutos = timeInputParaMinutos(duracaoMax);
  if (maxMinutos == null) return lista;
  return lista.filter((item) => duracaoEmMinutos(item) <= maxMinutos);
}

/** Agrupa turnos repetidos (um registro por dia) para exibição em selects. */
export function deduplicarTurnosParaSelect(turnos = []) {
  const mapa = new Map();
  for (const turno of turnos) {
    const chave = `${turno.nome_turno}|${turno.hora_inicio}|${turno.hora_fim}`;
    if (!mapa.has(chave)) {
      mapa.set(chave, turno);
    }
  }
  return Array.from(mapa.values());
}

/** Agrupa itens repetidos por um campo identificador. */
export function deduplicarPorCampo(lista = [], campo = 'id') {
  const mapa = new Map();
  for (const item of lista) {
    if (!item) continue;
    const valorRaw = item[campo];
    if (valorRaw === undefined || valorRaw === null || valorRaw === "") continue;
    const valor = String(valorRaw);
    if (!mapa.has(valor)) {
      mapa.set(valor, item);
    }
  }
  return Array.from(mapa.values());
}

/** Agrupa usuários repetidos (mesmo ID) para exibição em selects. */
export function deduplicarUsuarios(usuarios = []) {
  if (!Array.isArray(usuarios)) {
    console.warn("deduplicarUsuarios: entrada não é um array", usuarios);
    return [];
  }
  const mapa = new Map();
  for (const u of usuarios) {
    if (!u) continue;
    const idValue = u.id_operador ?? u.id_usuario ?? u.id;
    if (idValue !== undefined && idValue !== null && idValue !== "") {
      const key = String(idValue).trim();
      if (!mapa.has(key)) {
        mapa.set(key, u);
      }
    }
  }
  const resultado = Array.from(mapa.values());
  console.log(`Deduplicados: ${usuarios.length} -> ${resultado.length}`);
  return resultado;
}
