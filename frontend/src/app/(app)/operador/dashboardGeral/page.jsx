"use client";

import React from 'react';
import { KPI } from "@/components/ui/charts/components";
import { ProdutividadeDiariaWidget } from "@/features/operador/ProdutividadeDiariaWidget";
import { EficienciaMaquinaWidget }   from "@/features/operador/EficienciaMaquinaWidget";
import { ProducaoPorHoraOperadorWidget } from "@/features/operador/ProducaoPorHoraOperadorWidget";
import { QualidadeWidget }           from "@/features/operador/QualidadeWidget";
import { VelocimetroWidget }         from "@/features/operador/VelocimetroWidget";
import { OEEMaquinaWidget} from "@/features/operador/OEEMaquinaWidget";

const OPERADOR_ID = 1; // virá do token JWT futuramente

export default function DashboardGeralOperador() {
  return (
    <main className="min-h-screen bg-[url('/bg_app.svg')] bg-cover bg-fixed bg-center bg-no-repeat flex flex-col">
      
      {/* Título da Tela */}
      <section className="p-8">
        <div className="title_tela">
          <h1 className="underline decoration-secondary-foreground underline-offset-9 decoration-5 text-4xl font-semibold">
            Dashboard Geral
          </h1>
        </div>
      </section>

      {/* SEÇÃO 1: Meta | Produtividade | OEE */}
      <section className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Meta KPI */}
          <div className="bg-white border rounded-xl p-4 flex flex-col h-full">
            {/* <MetaKPIWidget operadorId={OPERADOR_ID} /> */}
            {/* ta dando erro no token, vou deixar pra depois, mas a ideia é essa: */} 

          </div>

          {/* Produtividade Diária */}
          <div className="bg-white border rounded-xl p-4">
            <ProdutividadeDiariaWidget operadorId={OPERADOR_ID} />
          </div>

          {/* Eficiência Máquina (OEE) */}
          <div className="bg-white border rounded-xl p-4">
            <OEEMaquinaWidget />
          </div>

        </div>
      </section>

      {/* SEÇÃO 2: Produção por Hora | Qualidade | Velocímetro */}
      <section className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Produção por Hora */}
          <div className="bg-white border rounded-xl p-4">
            <ProducaoPorHoraOperadorWidget operadorId={OPERADOR_ID} />
          </div>

          {/* Qualidade */}
          <div className="bg-white border rounded-xl p-4">
            <QualidadeWidget operadorId={OPERADOR_ID} />
          </div>

          {/* Velocímetro */}
          <div className="bg-white border rounded-xl p-4">
            <VelocimetroWidget operadorId={OPERADOR_ID} />
          </div>

        </div>
      </section>

    </main>
  );
}