"use client";

import React, { useState, useEffect } from "react";
import { ProdutividadeDiariaWidget }       from "@/features/operador/ProdutividadeDiariaWidget";
import { EficienciaMaquinaWidget }         from "@/features/operador/EficienciaMaquinaWidget";
import { ProducaoPorHoraOperadorWidget }   from "@/features/operador/ProducaoPorHoraOperadorWidget";
import { QualidadeWidget }                 from "@/features/operador/QualidadeWidget";
import { VelocimetroWidget }               from "@/features/operador/VelocimetroWidget";
import { OEEMaquinaWidget }                from "@/features/operador/OEEMaquinaWidget";

export default function DashboardGeralOperador() {
  const [operadorId, setOperadorId] = useState(null);


  // Lê o token só no cliente, após a hidratação
  useEffect(() => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const payload = JSON.parse(atob(token.split(".")[1]));
      if (payload?.id_usuario) setOperadorId(payload.id_usuario);
    } catch {
      // token ausente ou malformado
    }
  }, []);


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

      {/* SEÇÃO 1: OEE | Produtividade | Eficiência */}
      <section className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* OEE da Máquina */}
          <div className="bg-white border rounded-xl p-4">
            <OEEMaquinaWidget operadorId={operadorId} />
          </div>

          {/* Produtividade Diária */}
          <div className="bg-white border rounded-xl p-4">
            <ProdutividadeDiariaWidget operadorId={operadorId} />
          </div>

          {/* Eficiência por dia */}
          <div className="bg-white border rounded-xl p-4">
            <EficienciaMaquinaWidget operadorId={operadorId} />
          </div>

        </div>
      </section>

      {/* SEÇÃO 2: Produção por Hora | Qualidade | Velocímetro */}
      <section className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <div className="bg-white border rounded-xl p-4">
            <ProducaoPorHoraOperadorWidget operadorId={operadorId} />
          </div>

          <div className="bg-white border rounded-xl p-4">
            <QualidadeWidget operadorId={operadorId} />
          </div>

          <div className="bg-white border rounded-xl p-4">
            <VelocimetroWidget operadorId={operadorId} />
          </div>

        </div>
      </section>

    </main>
  );
}