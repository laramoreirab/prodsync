"use client";
import { GaugeSemicircular } from "@/components/ui/charts/components/GaugeSemicircular";
import { useOEEOperador } from "./hooks/useOEEOperador";
 
const metricas = [
  { key: "disponibilidade", label: "Disponibilidade", color: "#00357a" },
  { key: "performance",     label: "Performance",     color: "#00357a" },
  { key: "qualidade",       label: "Qualidade",       color: "#00357a" },
  { key: "oee",             label: "OEE Geral Consolidado", color: "#00357a" },
];
 
export function OEEOperadorWidget({ operadorId }) {
  const { data, loading, error } = useOEEOperador(operadorId);
 
  if (loading) return <p className="text-sm text-muted-foreground">Carregando OEE...</p>;
  if (error)   return <p className="text-sm text-destructive">Erro ao carregar OEE.</p>;
 
  return (
    <div className="flex flex-col gap-2">
      <div>
        <h2 className="text-sm font-semibold text-foreground">OEE Médio da Máquina do Operador</h2>
        <p className="text-xs text-muted-foreground">Visualizado em tempo real</p>
      </div>
 
      <div className="flex items-end justify-around gap-4 flex-wrap">
        {metricas.map(({ key, label, color }) => (
          <div key={key} className="flex flex-col items-center">
            <GaugeSemicircular
              title={label}
              data={[{ value: data[key], fill: color }]}
              size={key === "oee" ? "lg" : "default"}
              config={{ value: { label, color } }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
 