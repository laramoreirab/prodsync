export function formatarTelefone(valor) {
  if (!valor) return "—";
  let v = String(valor).replace(/\D/g, "");
  v = v.slice(0, 11);

  if (v.length <= 10) {
    return v.replace(
      /^(\d{2})(\d{0,4})(\d{0,4}).*/,
      (_, ddd, p1, p2) => `(${ddd}) ${p1}${p2 ? `-${p2}` : ""}`,
    );
  }

  return v.replace(
    /^(\d{2})(\d{0,5})(\d{0,4}).*/,
    (_, ddd, p1, p2) => `(${ddd}) ${p1}${p2 ? `-${p2}` : ""}`,
  );
}

export const PERIODOS_EVENTOS_RELATORIO = [
  { value: 7, label: "Últimos 7 dias" },
  { value: 15, label: "Últimos 15 dias" },
  { value: 30, label: "Último mês" },
];
