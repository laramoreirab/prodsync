"use client";

import { BarComValorETopo } from "@/components/ui/charts/components/BarComValorETopo";
import { useProducaoMediaSetor } from "./hooks/useProducaoMediaSetor";
import { producaoMediaConfig } from "./config/usuarioChartConfig";

export function ProducaoMediaSetorWidget() {
  const { data, loading, error } = useProducaoMediaSetor();

  if (loading) return <p className="text-sm text-muted-foreground">Sincronizando...</p>;
  if (error)   return <p className="text-sm text-destructive">Erro ao carregar dados.</p>;
  if (!data) return <p className="text-xs text-muted-foreground">Nenhum dado encontrado.</p>;
  if (Array.isArray(data) && data.length === 0) return <p className="text-xs text-muted-foreground">Nenhum registro disponível.</p>;

  return (
    <div>
      <p className="text-lg font-semibold text-black">
        Produção média de usuário por dia por setor
      </p>
          <p className="text-md text-muted-foreground font-medium mt-0.5">Atualizado em tempo real</p>


      <div className="mt-2">
        <BarComValorETopo
          data={data}
          config={producaoMediaConfig}
        />
      </div>
    </div>
  );
}