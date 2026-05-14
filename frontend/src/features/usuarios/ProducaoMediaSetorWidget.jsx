"use client";

import { BarComValorETopo } from "@/components/ui/charts/components/BarComValorETopo";
import { useProducaoMediaSetor } from "./hooks/useProducaoMediaSetor";
import { producaoMediaConfig } from "./config/usuarioChartConfig";

export function ProducaoMediaSetorWidget() {
  const { data, loading, error } = useProducaoMediaSetor();

  if (loading) return <p className="text-sm text-muted-foreground">Carregando...</p>;
  if (error)   return <p className="text-sm text-destructive">Erro ao carregar dados.</p>;

  return (
    <div>
      <p className="text-sm font-semibold text-black">
        Produção média de usuário por dia por setor
      </p>
      <p className="text-xs text-gray-400 font-semibold mt-1">
        *Atualizado em tempo real
      </p>

      <div className="mt-2">
        <BarComValorETopo
          data={data}
          config={producaoMediaConfig}
        />
      </div>
    </div>
  );
}