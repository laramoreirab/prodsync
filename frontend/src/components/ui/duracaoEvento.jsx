// src/components/DuracaoEvento.jsx
"use client"

import { useEffect, useState } from "react";
import { Clock4 } from "lucide-react";

function calcularMs(inicio, fim) {
  if (!inicio) return 0;
  const dataFim = fim ? new Date(fim) : new Date();
  return Math.max(0, dataFim - new Date(inicio));
}

function formatarDuracao(ms) {
  const totalSegundos = Math.floor(ms / 1000);
  const horas    = Math.floor(totalSegundos / 3600);
  const minutos  = Math.floor((totalSegundos % 3600) / 60);
  const segundos = totalSegundos % 60;

  return `${String(horas).padStart(2, "0")}:${String(minutos).padStart(2, "0")}:${String(segundos).padStart(2, "0")}`;
}

export function DuracaoEvento({ inicio, fim }) {
  const [duracao, setDuracao] = useState(() => formatarDuracao(calcularMs(inicio, fim)));

  useEffect(() => {
    // Evento encerrado: calcula uma vez e para
    if (fim) {
      setDuracao(formatarDuracao(calcularMs(inicio, fim)));
      return;
    }

    // Evento ativo: atualiza a cada segundo
    const interval = setInterval(() => {
      setDuracao(formatarDuracao(calcularMs(inicio, null)));
    }, 1000);

    return () => clearInterval(interval);
  }, [inicio, fim]);

  if (!inicio) return <span className="text-muted-foreground">-</span>;

  return (
    <span className="flex items-center gap-1.5 whitespace-nowrap tabular-nums">
      <Clock4 className="h-4 w-4 text-muted-foreground shrink-0" />
      {duracao}
    </span>
  );
}
