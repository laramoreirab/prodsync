"use client"

import { BarVerticalBase } from "@/components/ui/charts/components"
import { useMotivosFrequentes } from "./hooks/useMotivosFrequentes"
import { paradasChartConfig } from "./config/paradasChartConfig"

export function MotivosFrequentesWidget(){
    const { data, loading, error } = useMotivosFrequentes();
    
        if (loading) return <p className="text-xs text-muted-foreground">Carregando...</p>;
      if (error)   return <p className="text-xs text-red-500">Erro ao carregar dados.</p>;
      if (!data)   return <p className="text-xs text-muted-foreground">Nenhum dado encontrado.</p>;
      if (Array.isArray(data) && data.length === 0) return <p className="text-xs text-muted-foreground">Nenhum registro disponível.</p>;
      
      return (
        <BarVerticalBase
          title="Motivos mais frequentes de paradas"
          data={data}
          xKey="motivo"
          yKey="qtd"
          config={paradasChartConfig}
        />
      );
}