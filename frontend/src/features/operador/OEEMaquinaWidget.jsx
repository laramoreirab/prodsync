"use client";
import { BarHorizontal } from "@/components/ui/charts/components/BarHorizontal";
import { useOEEMaquina } from "./hooks/useOEEMaquina";

// Ajustamos a configuração para refletir o novo formato dos dados transformados
const config = {
  valor: { label: "Percentual (%)", color: "#00357a" },
};

export function OEEMaquinaWidget({ operadorId }) {
  const { data, loading, error } = useOEEMaquina(operadorId);

  if (loading) return <p className="text-sm text-muted-foreground">Sincronizando...</p>;
  if (error) return <p className="text-sm text-destructive">Erro.</p>;
  if (!data) return <p className="text-xs text-muted-foreground">Nenhum dado encontrado.</p>;
  
  // Considerando que 'data' seja o array "dados" da sua API [ { oee: 100, ... } ]
  const listaDados = Array.isArray(data) ? data : [];
  if (listaDados.length === 0) return <p className="text-xs text-muted-foreground">Nenhum registro disponível.</p>;

  // Pegamos o primeiro item do array de dados da API
  const metricasOriginais = listaDados[0];

  // TRANSFORMAÇÃO: Convertemos o objeto único em um array de linhas para o gráfico de barras
  const dadosFormatados = [
    { metrica: "OEE", valor: metricasOriginais.oee },
    { metrica: "Disponibilidade", valor: metricasOriginais.disponibilidade },
    { metrica: "Performance", valor: metricasOriginais.performance },
    { metrica: "Qualidade", valor: metricasOriginais.qualidade },
  ];

  return (
    <div>
      <p className="text-sm font-semibold text-black">OEE Médio da Máquina</p>
      <p className="text-[11px] text-muted-foreground font-medium mt-0.5">Atualizado em tempo real</p>
      
      <BarHorizontal 
        data={dadosFormatados} 
        config={config} 
        yKey="metrica"             // Diz ao gráfico para usar a propriedade "metrica" no eixo Y
        paddingTopClassName="pt-4" // Remove o buraco do topo, já que o título está fora
        showValueLabels={true}     // Ative se quiser ver os números (ex: 85.3) fixos na ponta da barra
      />
    </div>
  );
}