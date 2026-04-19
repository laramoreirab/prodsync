"use client"
import { KPI } from "@/components/ui/charts/components";
import { useProducaoPorTurnoLotes} from "./hooks/useProducaoPorTurnoLotes";

export function ProducaoPorTurnoLotesWidget(){
    const { data, loading, error } = useProducaoPorTurnoLotes();
    
      if (loading) return <p className="text-sm text-muted-foreground">Carregando...</p>;
      if (error)   return <p className="text-sm text-destructive">Erro ao carregar produção.</p>;
    
      return (
        <KPI
          title={data?.titulo}
          value={data?.valor}
        />
      );
}