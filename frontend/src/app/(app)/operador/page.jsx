"use client";

import React, { useState, useEffect } from "react";
import { ProdutividadeDiariaWidget }       from "@/features/operador/ProdutividadeDiariaWidget";
import { EficienciaMaquinaWidget }         from "@/features/operador/EficienciaMaquinaWidget";
import { ProducaoPorHoraOperadorWidget }   from "@/features/operador/ProducaoPorHoraOperadorWidget";
import { QualidadeWidget }                 from "@/features/operador/QualidadeWidget";
import { VelocimetroWidget }               from "@/features/operador/VelocimetroWidget";
import { OEEMaquinaWidget }                from "@/features/operador/OEEMaquinaWidget";
import { getUserFromToken } from "@/lib/auth";
import { PageLayout, PageHeader, WidgetCard, ContentGrid, SectionDivider } from "@/components/AnimatedComponents";



export default function DashboardGeralOperador() {
  const [operadorId, setOperadorId] = useState(null);


  // Lê o token só no cliente, após a hidratação
  useEffect(() => {
    const user = getUserFromToken();
    if (user?.id_usuario) setOperadorId(user.id_usuario);
  }, []);


 return (
  <PageLayout>
    <PageHeader
      title="Dashboard Geral"
    />

    <ContentGrid cols={3} className="mt-2">
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

    <ContentGrid cols={3} className="mt-2">
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
