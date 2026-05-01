"use client";
import { CustomPieChart } from "@/components/ui/charts/components/PieChart";
import { useOEEMaquinaDetalhes } from "./hooks/useOEEMaquinaDetalhes";
import { Badge } from "@/components/ui/badge";

const makeConfig = (cor) => ({
  valor: { label: "Valor", color: cor },
  resto: { label: "Resto", color: "#e2e8f0" },
});

const metricas = [
  { key: "disponibilidade", label: "Disponibilidade", cor: "#00357a" },
  { key: "performance",     label: "Performance",     cor: "#00357a" },
  { key: "qualidade",       label: "Qualidade",       cor: "#00357a" },
  { key: "oee",             label: "OEE geral",       cor: "#00357a" },
];

export function MaquinaOEEWidget() {
  const { data, loading, error } = useOEEMaquinaDetalhes();

  if (loading) return <p className="text-sm text-muted-foreground">Carregando...</p>;
  if (error)   return <p className="text-sm text-destructive">Erro.</p>;

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold underline decoration-secondary-foreground underline-offset-4 decoration-4">
          {data.nome_maquina}
        </h2>
        <Badge className={`flex items-center gap-1.5 px-3 py-1 text-sm font-semibold ${
          data.status === "Produzindo" 
            ? "bg-green-100 text-green-700" 
            : "bg-red-100 text-red-700"
        }`}>
          <span className={`w-2 h-2 rounded-full ${
            data.status === "Produzindo" ? "bg-green-500" : "bg-red-500"
          }`} />
          {data.status}
        </Badge>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {metricas.map(({ key, label, cor }) => {
          const valor = data[key] ?? 0;
          const chartData = [
            { name: "valor", value: valor },
            { name: "resto", value: 100 - valor },
          ];
          return (
            <div key={key} className="bg-white border rounded-xl p-4 flex flex-col items-center gap-2">
              <CustomPieChart
                data={chartData}
                config={makeConfig(cor)}
                dataKey="value"
              />
              <p className="text-sm font-semibold text-gray-700">{label}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}