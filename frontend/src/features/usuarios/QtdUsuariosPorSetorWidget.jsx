"use client";

import { BarHorizontal } from "@/components/ui/charts/components/BarHorizontal";
import { useQtdUsuariosPorSetor } from "./hooks/useQtdUsuariosPorSetor";
import { qtdUsuariosSetorConfig } from "./config/usuarioChartConfig";

export function QtdUsuariosPorSetorWidget() {
  const { data, loading, error } = useQtdUsuariosPorSetor();

  if (loading) return <p className="text-sm text-muted-foreground">Carregando...</p>;
  if (error)   return <p className="text-sm text-destructive">Erro ao carregar dados.</p>;

  return (
    <div>
      <p className="text-sm font-semibold text-black">
        Quantidade de usuários por setor
      </p>
      <p className="text-xs text-gray-400 font-semibold mt-1">
        *Atualizado em tempo real
      </p>

      <div className="mt-2">
        <BarHorizontal
          data={data}
          config={qtdUsuariosSetorConfig}
        />
      </div>
    </div>
  );
}