"use client"
import { KPI } from "@/components/ui/charts/components";
import { useMaquinaAtivaPorTurno } from "./hooks/useMaquinaAtivaPorTurno.js";


export function MaquinaAtivaPorTurnoWidget(){
    const { data, loading, error } = useMaquinaAtivaPorTurno();
    
      if (loading) return <p className="text-sm text-muted-foreground">Carregando...</p>;
      if (error)   return <p className="text-sm text-destructive">Erro ao carregar produção.</p>;
    
      return (
        <KPI
          title={data?.titulo}
          value={data?.valor}
        />
      );
}