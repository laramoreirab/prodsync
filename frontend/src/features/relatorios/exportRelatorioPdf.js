/** Dispara a impressão do navegador (Salvar como PDF). */
export function exportRelatorioPdf() {
  if (typeof window === "undefined") return;
  window.print();
}
