"use client";

import { Plus, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Ícone único: + gira 90° (direita) e vira seta para baixo ao abrir; ao fechar, volta.
 * A seta não herda rotação — permanece apontando para baixo.
 */
export function PlusChevronToggleIcon({ open, className }) {
  return (
    <span
      className={cn(
        "relative inline-flex h-5 w-5 shrink-0 items-center justify-center",
        className
      )}
      aria-hidden
    >
      <Plus
        strokeWidth={2.5}
        className={cn(
          "absolute h-5 w-5 duration-1000 ",
          open ? "rotate-90 opacity-0" : "rotate-0 opacity-100"
        )}
      />
      <ChevronDown
        strokeWidth={2.5}
        className={cn(
          "absolute h-5 w-5 duration-800 ",
          open ? "rotate-0 opacity-100" : "rotate-0 opacity-0"
        )}
      />
    </span>
  );
}
