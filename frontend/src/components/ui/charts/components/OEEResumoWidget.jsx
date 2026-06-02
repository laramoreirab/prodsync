"use client";

import { GaugeSemicircular } from "./GaugeSemicircular"; // Ajuste o caminho do import se necessário

export function OeeResumoWidget({ data }) {
  const oeeGeral = data?.oee ?? 0;
  const disponibilidade = data?.disponibilidade ?? 0;
  const performance = data?.performance ?? 0;
  const qualidade = data?.qualidade ?? 0;

  const oeeGaugeConfig = {
    oeeGeral: {
      label: "OEE Geral",
      color: "#00357a", // Cor principal do preenchimento do arco
    },
  };

  const oeeGaugeData = [
    { value: oeeGeral }
  ];

  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm h-full flex flex-col justify-between space-y-6">
      
      {/* Cabeçalho do Card */}
      <div>
        <h3 className="text-sm font-semibold text-slate-950">Resumo OEE geral da Fábrica</h3>
        <p className="text-xs text-muted-foreground mt-0.5">Atualizando em tempo real</p>
      </div>

      {/* Seção Central: O Gauge Semicircular Customizado */}
      <div className="flex justify-center items-center py-2">
        <GaugeSemicircular 
          data={oeeGaugeData} 
          config={oeeGaugeConfig} 
          size="lg" // Tamanho ideal para dar destaque ao KPI principal
          title="OEE Geral da Fábrica"
        />
      </div>

      {/* Seção Inferior: Os 3 Sub-indicadores Lineares (D, P, Q) */}
      <div className="space-y-4 pt-2">
        
        {/* Barra de Disponibilidade */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-medium">
            <span className="text-muted-foreground font-semibold">Disponibilidade</span>
            <span className="font-bold text-slate-900">{disponibilidade}%</span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full rounded-full transition-all duration-500" 
              style={{ 
                width: `${Math.max(0, Math.min(100, disponibilidade))}%`, 
                backgroundColor: "#00357a" 
              }}
            />
          </div>
        </div>

        {/* Barra de Performance */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-medium">
            <span className="text-muted-foreground font-semibold">Performance</span>
            <span className="font-bold text-slate-900">{performance}%</span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full rounded-full transition-all duration-500" 
              style={{ 
                width: `${Math.max(0, Math.min(100, performance))}%`, 
                backgroundColor: "#00357a" 
              }}
            />
          </div>
        </div>

        {/* Barra de Qualidade */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-medium">
            <span className="text-muted-foreground font-semibold">Qualidade</span>
            <span className="font-bold text-slate-900">{qualidade}%</span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full rounded-full transition-all duration-500" 
              style={{ 
                width: `${Math.max(0, Math.min(100, qualidade))}%`, 
                backgroundColor: "#00357a" 
              }}
            />
          </div>
        </div>

      </div>
    </div>
  );
}
