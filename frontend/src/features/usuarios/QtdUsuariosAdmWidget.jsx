"use client";

import { BarHorizontal } from "@/components/ui/charts/components/BarHorizontal";
import { useQtdUsuariosPorPerfil } from "./hooks/useQtdUsuariosPorPerfil";
import { qtdUsuariosPerfilBarConfig, qtdUsuariosPerfilConfig } from "./config/usuarioChartConfig";

export function QtdUsuariosAdmWidget() {
  const { data, loading, error } = useQtdUsuariosPorPerfil();

  if (loading) return <p className="text-sm text-muted-foreground">Sincronizando...</p>;
  if (error) return <p className="text-sm text-destructive">Erro ao carregar status.</p>;
  if (!data) return <p className="text-xs text-muted-foreground">Nenhum dado encontrado.</p>;
  if (Array.isArray(data) && data.length === 0) return <p className="text-xs text-muted-foreground">Nenhum registro disponivel.</p>;

  const chartData = data
    .filter((item) => {
      const name = item.name?.toLowerCase();
      return name === "gestor" || name === "gestores" || name === "operador" || name === "operadores";
    })
    .map((item) => {
      const name = item.name?.toLowerCase();
      const perfil = name === "gestor" || name === "gestores" ? "Gestores" : "Operadores";

      return {
        perfil,
        quantidade: item.value ?? 0,
        color: qtdUsuariosPerfilConfig[perfil.toLowerCase()]?.color,
      };
    });

  return (
    <div className="h-full">
        <p className="text-sm font-semibold text-black">
       Quantidade de usuarios
      </p>
          <p className="text-[11px] text-muted-foreground font-medium mt-0.5">Atualizado em tempo real</p>

      <div className="mt-6 -ml-6">
        <BarHorizontal
          data={chartData}
          config={qtdUsuariosPerfilBarConfig}
          yKey="perfil"
          heightClassName="h-[180px]"
          colorKey="color"
          showValueLabels
        />
      </div>
    </div>
  );
}
