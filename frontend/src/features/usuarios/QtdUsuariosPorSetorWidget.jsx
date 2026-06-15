"use client";

import { BarHorizontal } from "@/components/ui/charts/components/BarHorizontal";
import { useQtdUsuariosPorSetor } from "./hooks/useQtdUsuariosPorSetor";
import { qtdUsuariosSetorConfig } from "./config/usuarioChartConfig";

export function QtdUsuariosPorSetorWidget() {
  const { data, loading, error } = useQtdUsuariosPorSetor();

 if (loading) return <p className="text-sm text-muted-foreground">Sincronizando...</p>;
  if (error) return <p className="text-sm text-destructive">Erro ao carregar status.</p>;
   if (!data) return <p className="text-xs text-muted-foreground">Nenhum dado encontrado.</p>;
  if (Array.isArray(data) && data.length === 0) return <p className="text-xs text-muted-foreground">Nenhum registro disponível.</p>;

  return (
    <div>
      <p className="text-sm font-semibold text-black">
        Quantidade de usuários por setor
      </p>
          <p className="text-[11px] text-muted-foreground font-medium mt-0.5">Atualizado em tempo real</p>


      <div className="mt-2">
        <BarHorizontal
          data={data}
          config={qtdUsuariosSetorConfig}
        />
      </div>
    </div>
  );
}