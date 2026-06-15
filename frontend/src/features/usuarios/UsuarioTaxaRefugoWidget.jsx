"use client";

import { BarHorizontal } from "@/components/ui/charts/components/BarHorizontal";
import { useUsuarioTaxaRefugo } from "./hooks/useUsuarioTaxaRefugo";
import { taxaRefugoUsuarioConfig } from "./config/usuarioChartConfig";

export function UsuarioTaxaRefugoWidget({ setorId }) {
  const { data, loading, error } = useUsuarioTaxaRefugo(setorId);

  if (loading) return <p className="text-xs text-muted-foreground">Carregando...</p>;
  if (error) return <p className="text-xs text-red-500">Erro ao carregar dados.</p>;
  if (!data) return <p className="text-xs text-muted-foreground">Nenhum dado encontrado.</p>;
  if (Array.isArray(data) && data.length === 0) return <p className="text-xs text-muted-foreground">Nenhum registro disponível.</p>;

  return (
    <div>
      <p className="text-sm font-semibold text-black">Usuário com Maior Taxa de Refugo</p>
          <p className="text-[11px] text-muted-foreground font-medium mt-0.5">Atualizado em tempo real</p>

      <div className="mt-4">
        <BarHorizontal
          data={data}
          config={taxaRefugoUsuarioConfig}
          yKey="operador"
          paddingTopClassName="pt-0"
          showValueLabels
          hideTooltipLabel
        />
      </div>
    </div>
  );
}