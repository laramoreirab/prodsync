"use client";

import { DonutChart } from "@/components/ui/charts/components";
import { useQtdUsuariosPorPerfil } from "./hooks/useQtdUsuariosPorPerfil";
import {usuariosPorPerfilConfig} from "./config/usuarioChartConfig";
export function QtdUsuariosWidget() {
  const { data, loading, error } = useQtdUsuariosPorPerfil();

  if (loading) return <p className="text-xs text-muted-foreground">Carregando...</p>;
  if (error) return <p className="text-xs text-red-500">Erro ao carregar dados.</p>;
  if (!data) return <p className="text-xs text-muted-foreground">Nenhum dado encontrado.</p>;
  if (Array.isArray(data) && data.length === 0) return <p className="text-xs text-muted-foreground">Nenhum registro disponível.</p>;

  const operadores = data.find((item) => item.name.toLowerCase() === "operadores")?.value ?? 0;

  return (
    <div className="h-full">
      <p className="text-sm font-semibold text-black">
        Quantidade de usuários por perfil
      </p>
      <p className="text-xs text-gray-400 font-semibold mt-1">
        *Atualizado em tempo real
      </p>
      <DonutChart
        data={data}
        nameKey="name"
        dataKey="value"
        config={usuariosPorPerfilConfig}
        chartSize="donutDefault"
      />
    </div>
  );
}