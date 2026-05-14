"use client";

import { useEficienciaMaquina } from "./hooks/useEficienciaMaquina";
import { BarHorizontal } from "@/components/ui/charts/components/BarHorizontal";
import { eficienciaConfig } from "@/features/operador/config/operadorConfig"


export function EficienciaMaquinaWidget({ operadorId }) {
  const { data, loading, error } = useEficienciaMaquina(operadorId);

  if (loading) return <p className="text-sm text-muted-foreground">Carregando...</p>;
  if (error)   return <p className="text-sm text-destructive">Erro ao carregar eficiência.</p>;

  const formattedData = data?.map(item => ({
    ...item,
    setor: item.dia 
  }));

  return (
    <div className="flex flex-col">
      <p className="text-sm font-semibold text-black">Eficiência da Máquina por Dia</p>
      <p className="text-xs text-gray-400 font-semibold mt-1 mb-2">*Atualizado em tempo real</p>
      
      <BarHorizontal 
        data={formattedData} 
        config={eficienciaConfig} 
      />
    </div>
  );
}