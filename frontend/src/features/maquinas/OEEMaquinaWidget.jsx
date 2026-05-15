"use client";
import { GaugeSemicircular } from "@/components/ui/charts/components/GaugeSemicircular";
import { useOEEMaquina } from "./hooks/useOEEMaquina";
import { oeeMetricasMaquinaConfig } from "./config/maquinaDetalheConfig";
 
export function OEEMaquinaWidget({ maquinaId }) {
  const { data, loading, error } = useOEEMaquina(maquinaId);
 
  if (loading) return <p className="text-sm text-muted-foreground">Carregando OEE...</p>;
  if (error)   return <p className="text-sm text-destructive">Erro ao carregar OEE.</p>;
 
  return (
    <div className="flex flex-col gap-2">
      <div>
        <h2 className="text-sm font-semibold text-foreground">Resumo OEE geral da Máquina</h2>
        <p className="text-xs text-muted-foreground">*Atualizado em tempo real</p>
      </div>
      <div className="flex items-end justify-around gap-4">
        {oeeMetricasMaquinaConfig.map(({ key, label, color }) => (
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
 