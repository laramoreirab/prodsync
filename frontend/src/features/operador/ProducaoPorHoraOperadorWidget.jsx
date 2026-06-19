"use client";

import { AreaChartBase } from "@/components/ui/charts/components/AreaChart";
import { useProducaoPorHoraOperador } from "./hooks/useProducaoPorHoraOperador";
import { producaoPorHoraConfig } from "@/features/operador/config/operadorConfig"

export function ProducaoPorHoraOperadorWidget({ operadorId }) {
  const { data, loading, error } = useProducaoPorHoraOperador(operadorId);

  const Header = () => (
    <>
      <p className="text-sm font-semibold text-black">Produção por Hora</p>
      <p className="text-[11px] text-muted-foreground font-medium mt-0.5">
        Atualizado em tempo real
      </p>
    </>
  );

  // Tratamento de estados diretamente antes de renderizar o gráfico
  if (loading) return <p className="text-xs text-muted-foreground">Sincronizando...</p>;
  if (error)   return <p className="text-xs text-red-500">Erro ao carregar produção.</p>;
  if (!data) {
    return (
      <div>
        <Header />
        <p className="mt-6 text-xs text-muted-foreground">Nenhum dado encontrado.</p>
      </div>
    );
  }
  if (Array.isArray(data) && data.length === 0) {
    return (
      <div>
        <Header />
        <p className="mt-6 text-xs text-muted-foreground">
          Nenhum registro de produção por hora disponível.
        </p>
      </div>
    );
  }

  return (
    <AreaChartBase
      title="Produção por Hora"
      data={data}
      config={producaoPorHoraConfig}
      xKey="hora"
      yKey="qtd"
      size="AA" 
    />
  );
}