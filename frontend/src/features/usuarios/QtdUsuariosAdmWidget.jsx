"use client";

import { CustomPieChart } from "@/components/ui/charts/components/PieChart";
import { useQtdUsuariosPorPerfil } from "./hooks/useQtdUsuariosPorPerfil";
import { qtdUsuariosPerfilConfig } from "./config/usuarioChartConfig";

export function QtdUsuariosAdmWidget() {
  const { data, loading, error } = useQtdUsuariosPorPerfil();

  if (loading) return <p className="text-sm text-muted-foreground">Carregando...</p>;
  if (error) return <p className="text-sm text-destructive">Erro ao carregar status.</p>;
  if (!data) return <p className="text-xs text-muted-foreground">Nenhum dado encontrado.</p>;
  if (Array.isArray(data) && data.length === 0) return <p className="text-xs text-muted-foreground">Nenhum registro disponivel.</p>;

  const chartData = data.map((item) => {
    const name = item.name?.toLowerCase();
    const normalizedName =
      name === "gestor" ? "gestores" :
      name === "operador" ? "operadores" :
      name;

    return {
      ...item,
      name: normalizedName,
    };
  });

  return (
    <div className="h-full">
        <p className="text-sm font-semibold text-black">
       Quantidade de usuarios
      </p>
      <p className="text-xs text-gray-400 font-semibold mt-1">
        *Atualizado em tempo real
      </p>
      <CustomPieChart
        data={chartData}
        config={qtdUsuariosPerfilConfig}
        dataKey="value"
      />
    </div>
  );
}
