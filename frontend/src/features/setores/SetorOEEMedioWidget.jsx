"use client";

import { useState, useEffect } from "react";
import { GaugeSemicircular } from "@/components/ui/charts/components/GaugeSemicircular";
import { useSetorOEEMedio } from "./hooks/useSetorOEEMedio";

const oeeConfig = {
  value: { label: "OEE", color: "#00357a" },
};

export function SetorOEEMedioWidget({ setorId }) {
  const { data, loading, error } = useSetorOEEMedio(setorId);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const checkDark = () => setIsDark(document.documentElement.classList.contains("dark"));
    checkDark();
    const observer = new MutationObserver(checkDark);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  const fillColor = isDark ? "#7d95c6" : "#00357a";

  if (loading) return <p className="text-sm text-muted-foreground">Sincronizando...</p>;
  if (error) return <p className="text-sm text-destructive">Erro ao carregar status.</p>;
  if (!data) return <p className="text-xs text-muted-foreground">Nenhum dado encontrado.</p>;
  if (Array.isArray(data) && data.length === 0) return <p className="text-xs text-muted-foreground">Nenhum registro disponível.</p>;

  return (
    <div className="flex h-full w-full flex-col">
      <div className="shrink-0">
        <p className="text-sm font-semibold text-black">OEE médio do Setor</p>
        <p className="text-[11px] text-muted-foreground font-medium mt-0.5">
          Atualizado em tempo real
        </p>
      </div>

      <div className="min-h-0 flex-1 flex flex-col justify-center items-center w-full">
        <div className="w-full flex justify-center flex-col items-center">
          <GaugeSemicircular
            title={data.setor}
            data={[{ value: data.oee, fill: fillColor }]}
            size="xlg"
            config={oeeConfig}
          />
        </div>
      </div>
    </div>
  );
}