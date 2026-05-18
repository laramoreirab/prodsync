"use client";

import { useState, useEffect } from "react";
import { SetorProducaoDiariaWidget } from "@/features/setores/SetorProducaoDiariaWidget";
import { SetorOEEMedioWidget } from "@/features/setores/SetorOEEMedioWidget";
import { SetorOEEEvolucaoWidget } from "@/features/setores/SetorOEEEvolucaoWidget";
import { SetorTopOperadoresWidget } from "@/features/setores/SetorTopOperadoresWidget";
import { SetorMotivosParadaWidget } from "@/features/setores/SetorMotivosParadaWidget";
import { SetorProducaoMaquinaWidget } from "@/features/setores/SetorProducaoMaquinaWidget";
import { SetorStatusDonutWidget } from "@/features/setores/SetorStatusDonutWidget";
import { TendendiaRefugoWidget } from "@/features/refugo/TendenciaRefugoWidget";
import { MediaParadasDiaWidget } from "@/features/paradas/MediaParadasDiaWidget";
import { PecasPorMinutoWidget } from "@/features/producao/PecasPorMinutoWidget";
import { MaquinaAtivaPorTurnoWidget } from "@/features/maquinas/MaquinaAtivaPorTurnoWidget";
import { ProducaoPorTurnoLotesWidget } from "@/features/producao/ProducaoPorTurnoLotesWidget";
import { PageLayout, PageHeader, WidgetCard, KPIGrid, ContentGrid } from "@/components/AnimatedComponents";


export default function DashboardGeralGestor() {
  const [setorId, setSetorId] = useState(null);

  useEffect(() => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const payload = JSON.parse(atob(token.split(".")[1]));
      if (payload?.id_setor) setSetorId(payload.id_setor);
    } catch {
      // token ausente ou malformado
    }
  }, []);

  return (
    <PageLayout>
      <PageHeader title="Dashboard Geral do Setor" />


      <ContentGrid cols={1}>
        <WidgetCard>
          <SetorProducaoDiariaWidget setorId={setorId} />
        </WidgetCard>
      </ContentGrid>

      <ContentGrid cols={1}>
        <WidgetCard>
          <SetorOEEMedioWidget setorId={setorId} />
        </WidgetCard>
      </ContentGrid>

      <ContentGrid cols={2}>
        <WidgetCard centered>
          <SetorOEEEvolucaoWidget setorId={setorId} />
        </WidgetCard>
        <WidgetCard>
          <SetorTopOperadoresWidget setorId={setorId} />
        </WidgetCard>
      </ContentGrid>

      <ContentGrid cols={2}>
        <WidgetCard>
          <SetorProducaoMaquinaWidget setorId={setorId} />
        </WidgetCard>
        <WidgetCard>
          <SetorStatusDonutWidget setorId={setorId} />
        </WidgetCard>
      </ContentGrid>

      <ContentGrid cols={2}>
        <WidgetCard>
          <SetorMotivosParadaWidget setorId={setorId} />
        </WidgetCard>
        <WidgetCard>
          <TendendiaRefugoWidget setorId={setorId} />
        </WidgetCard>
      </ContentGrid>

      <KPIGrid cols={4}>
        <WidgetCard>
          <MediaParadasDiaWidget />
        </WidgetCard>
        <WidgetCard>
          <PecasPorMinutoWidget />
        </WidgetCard>
        <WidgetCard>
          <MaquinaAtivaPorTurnoWidget />
        </WidgetCard>
        <WidgetCard>
          <ProducaoPorTurnoLotesWidget />
        </WidgetCard>
      </KPIGrid>
    </PageLayout>

  );
}
