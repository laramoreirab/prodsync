"use client";

import { AreaChartBase } from "@/components/ui/charts/components/AreaChart";
import { useTendenciaRefugo } from "./hooks/useTendenciaRefugo";
import { tendenciaRefugoConfig } from "./config/refugoChartConfig";

function formatarDataBR(valor) {
  if (!valor) return valor;

  const [ano, mes, dia] = String(valor).split("T")[0].split("-");
  if (!ano || !mes || !dia) return valor;

  return `${dia}/${mes}/${ano}`;
}

export function TendendiaRefugoWidget({ setorId = null }) {
  const { data, loading, error } = useTendenciaRefugo(setorId);

  if (loading) return <p className="text-sm text-muted-foreground">Sincronizando...</p>;
  if (error)   return <p className="text-sm text-destructive">Erro ao carregar refugo.</p>;
   if (!data) return <p className="text-xs text-muted-foreground">Nenhum dado encontrado.</p>;
  if (Array.isArray(data) && data.length === 0) return <p className="text-xs text-muted-foreground">Nenhum registro disponível.</p>;

  const dadosFormatados = data.map((item) => ({
    ...item,
    dia: formatarDataBR(item.dia),
  }));

  return (
    <AreaChartBase
      title="Tendência de Refugo"
      data={dadosFormatados}
      size="pequeno"
      xKey="dia"
      yKey="qtd"
      config={tendenciaRefugoConfig}
    />
  );
}
