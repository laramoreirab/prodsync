"use client";

import { BarHorizontal } from "@/components/ui/charts/components/BarHorizontal";
import { useQtdUsuariosPorSetor } from "./hooks/useQtdUsuariosPorSetor";
import { qtdUsuariosSetorConfig } from "./config/usuarioChartConfig";

const TOP_SETORES_LIMIT = 5;

export function QtdUsuariosPorSetorWidget() {
  const { data, loading, error } = useQtdUsuariosPorSetor();
  const dadosGrafico = Array.isArray(data)
    ? data
        .filter((item) => Number(item.qtd) > 0)
        .sort((a, b) => Number(b.qtd) - Number(a.qtd))
        .slice(0, TOP_SETORES_LIMIT)
    : [];
  const semRegistros =
    Array.isArray(data) &&
    (data.length === 0 || dadosGrafico.length === 0);

  if (loading) return <p className="text-sm text-muted-foreground">Sincronizando...</p>;
  if (error) return <p className="text-sm text-destructive">Erro ao carregar status.</p>;
  if (!data) return <p className="text-xs text-muted-foreground">Nenhum dado encontrado.</p>;
  if (semRegistros) return <p className="text-xs text-muted-foreground">Nenhum registro disponível.</p>;

  return (
    <div>
      <p className="text-sm font-semibold text-black">
        Top 5 Setores Com Mais Usuários
      </p>
      <p className="text-[11px] text-muted-foreground font-medium mt-0.5">
        Atualizado em tempo real
      </p>

      <div className="mt-2">
        <BarHorizontal
          data={dadosGrafico}
          config={qtdUsuariosSetorConfig}
          heightClassName="h-[260px]"
          paddingTopClassName="pt-4"
          yAxisWidth={130}
          barSize={22}
          showValueLabels
        />
      </div>
    </div>
  );
}
