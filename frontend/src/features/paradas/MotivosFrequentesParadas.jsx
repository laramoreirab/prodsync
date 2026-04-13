"use client"

import { BarVerticalBase } from "@/components/ui/charts/components"
import { useMotivosFrequentes } from "./hooks/useMotivosFrequentes"
import { paradasChartConfig } from "./config/paradasChartConfig"

export function MotivosFrequentesWidget(){
    const { data, loading, error } = useMotivosFrequentes();
    
      if (loading) return <p className="text-sm text-muted-foreground">Carregando...</p>;
      if (error)   return <p className="text-sm text-destructive">Erro ao carregar produção.</p>;
    
      return (
        <BarVerticalBase
          title="Motivos mais frequentes de paradas"
          data={data}
          xKey="motivo"
          yKeys={"qtd"}
          config={paradasChartConfig}
        />
      );
}