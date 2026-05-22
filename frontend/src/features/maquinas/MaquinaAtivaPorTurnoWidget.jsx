"use client"
import { KPI } from "@/components/ui/charts/components";
import { useMaquinaAtivaPorTurno } from "./hooks/useMaquinaAtivaPorTurno.js";


export function MaquinaAtivaPorTurnoWidget(){
    const { data, loading, error } = useMaquinaAtivaPorTurno();
    
    if (loading) return <p className="text-xs text-muted-foreground">Carregando...</p>;
    if (error)   return <p className="text-sm text-destructive">Erro ao carregar dados.</p>;
    if (!data)   return <p className="text-xs text-muted-foreground">Nenhum dado encontrado.</p>;
    if (Array.isArray(data) && data.length === 0) return <p className="text-xs text-muted-foreground">Nenhum registro disponível.</p>;
    
      return (
        <KPI
          title={data?.titulo}
          value={data?.valor}
        />
      );
}