"use client"
import { KPIRetangulo } from "@/components/ui/charts/components";
import { useMediaParadasDia } from "./hooks/useMediaParadasDia";

export function MediaParadasDiaWidget(){
    const { data, loading, error } = useMediaParadasDia();
    
        if (loading) return <p className="text-xs text-muted-foreground">Carregando...</p>;
      if (error)   return <p className="text-xs text-red-500">Erro ao carregar dados.</p>;
      if (!data)   return <p className="text-xs text-muted-foreground">Nenhum dado encontrado.</p>;
      if (Array.isArray(data) && data.length === 0) return <p className="text-xs text-muted-foreground">Nenhum registro disponível.</p>;
      
      return (
        <KPIRetangulo
          title={data?.titulo}
          value={data?.valor}
        />
      );
}