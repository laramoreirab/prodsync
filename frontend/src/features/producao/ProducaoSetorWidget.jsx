"use client";

import { BarHorizontal } from "@/components/ui/charts/components/BarHorizontal";
import { useProducaoSetor } from "./hooks/UseProducaoSetor";
import { producaoSetorConfig } from "./config/producaoChartConfig";

export function ProducaoSetorWidget() {
  const { data, loading, error } = useProducaoSetor();
  const dadosGrafico = Array.isArray(data)
    ? data
        .filter((item) => Number(item.qtd) > 0)
        .sort((a, b) => Number(b.qtd) - Number(a.qtd))
        .slice(0, 5)
    : [];
  const semRegistros =
    Array.isArray(data) &&
    (data.length === 0 || dadosGrafico.length === 0);

  if (loading) return <p className="text-sm text-muted-foreground">Sincronizando...</p>;
  if (error) return <p className="text-sm text-destructive">Erro ao carregar produção.</p>;
  if (!data) return <p className="text-xs text-muted-foreground">Nenhum dado encontrado.</p>;
  if (semRegistros) return <p className="text-xs text-muted-foreground">Nenhum registro disponível.</p>;

  return (
    <BarHorizontal
      title="Produção por setor"
      data={dadosGrafico}
      config={producaoSetorConfig}
      heightClassName="h-[260px]"
      paddingTopClassName="pt-14"
      yAxisWidth={150}
      barSize={18}
      showValueLabels
    />
  );
}
