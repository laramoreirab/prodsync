"use client";

import React, { useState, useEffect } from "react";
import { ProdutividadeDiariaWidget }       from "@/features/operador/ProdutividadeDiariaWidget";
import { EficienciaMaquinaWidget }         from "@/features/operador/EficienciaMaquinaWidget";
import { ProducaoPorHoraOperadorWidget }   from "@/features/operador/ProducaoPorHoraOperadorWidget";
import { QualidadeWidget }                 from "@/features/operador/QualidadeWidget";
import { VelocimetroWidget }               from "@/features/operador/VelocimetroWidget";
import { OEEMaquinaWidget }                from "@/features/operador/OEEMaquinaWidget";

import { Plus, Search, EyeIcon, Pencil, Trash2, Loader2 } from "lucide-react";

import { PageLayout, PageHeader, WidgetCard, KPIGrid, ContentGrid } from "@/components/AnimatedComponents";



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
  <PageLayout>
    <PageHeader title="Dashboard Geral" />

    {/* SEÇÃO 1: OEE | Produtividade | Eficiência */}
    <ContentGrid cols={3}>
      <WidgetCard>
        <OEEMaquinaWidget operadorId={operadorId} />
      </WidgetCard>
      <WidgetCard>
        <ProdutividadeDiariaWidget operadorId={operadorId} />
      </WidgetCard>
      <WidgetCard>
        <EficienciaMaquinaWidget operadorId={operadorId} />
      </WidgetCard>
    </ContentGrid>

    {/* SEÇÃO 2: Produção por Hora | Qualidade | Velocímetro */}
    <ContentGrid cols={3}>
      <WidgetCard>
        <ProducaoPorHoraOperadorWidget operadorId={operadorId} />
      </WidgetCard>
      <WidgetCard>
        <QualidadeWidget operadorId={operadorId} />
      </WidgetCard>
      <WidgetCard>
        <VelocimetroWidget operadorId={operadorId} />
      </WidgetCard>
    </ContentGrid>
  </PageLayout>
);
}