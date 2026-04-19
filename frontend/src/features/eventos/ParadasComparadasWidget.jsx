"use client"

import { DonutChart } from "@/components/ui/charts/components"
import { useParadasComparadas } from "./hooks/useParadasComparadas"
import { paradasComparadasConfig } from "./config/paradasComparadasConfig"

export function ParadasComparadasWidget(){
    const { data, loading, error } = useParadasComparadas();
    
      if (loading) return <p className="text-sm text-muted-foreground">Carregando...</p>;
      if (error)   return <p className="text-sm text-destructive">Erro ao carregar produção.</p>;
    
      return (
        <DonutChart
          title="Paradas Comparadas"
          data={data}
          labelKey="motivo"
          valueKey="qtd"
          config={paradasComparadasConfig}
        />
      );
}