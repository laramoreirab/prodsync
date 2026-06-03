"use client";

import { cn } from "@/lib/utils";

export function RelatorioSection({ id, ativo, titulo, children, className }) {
  if (!ativo) return null;

  return (
    <section
      data-print-section={id}
      className={cn("relatorio-secao break-inside-avoid", className)}
    >
      {titulo ? (
        <h3 className="relatorio-secao-titulo mb-3 text-lg font-semibold text-[#23304c]">
          {titulo}
        </h3>
      ) : null}
      {children}
    </section>
  );
}

export function RelatorioWidgetCard({ children, className, centered }) {
  return (
    <div
      className={cn(
        "relatorio-widget-card rounded-2xl border border-gray-200/90 bg-white p-4 shadow-sm sm:p-6",
        centered && "flex flex-col items-center justify-center",
        className,
      )}
    >
      {children}
    </div>
  );
}
