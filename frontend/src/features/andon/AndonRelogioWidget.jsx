"use client";

import { useState, useEffect } from "react";
import { Clock } from "lucide-react";

export function AndonRelogioWidget() {
  const [agora, setAgora] = useState(new Date());

  useEffect(() => {
    const intervalo = setInterval(() => setAgora(new Date()), 1000);
    return () => clearInterval(intervalo);
  }, []);

  const hora = agora.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  const data = agora.toLocaleDateString("pt-BR");

  return (
    <div className="flex items-center gap-2 text-gray-600 font-semibold text-lg">
      <Clock className="w-5 h-5" />
      <span>{hora} | {data}</span>
    </div>
  );
}