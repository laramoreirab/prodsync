"use client"

import { ProducaoSetorWidget } from "@/features/producao/ProducaoSetorWidget";
import { ProducaoDiaWidget } from "@/features/producao/ProducaoDiaWidget";
import { OEEWidget } from "@/features/producao/OEEWidget";
import { MaquinaStatusWidget } from "@/features/maquinas/MaquinaStatusWidget";
import { MotivosFrequentesWidget } from "@/features/paradas/MotivosFrequentesParadas";
import { TendendiaRefugoWidget } from "@/features/refugo/TendenciaRefugoWidget";
import { MediaParadasDiaWidget } from "@/features/paradas/MediaParadasDiaWidget";
import { PecasPorMinutoWidget } from "@/features/producao/PecasPorMinutoWidget";
import { ProducaoPorTurnoLotesWidget } from "@/features/producao/ProducaoPorTurnoLotesWidget";
import { MaquinaAtivaPorTurnoWidget } from "@/features/maquinas/MaquinaAtivaPorTurnoWidget";

import { PageLayout, KPICardDecorated, AsymmetricGrid, PageHeader, WidgetCard, KPIGrid, ContentGrid, SectionDivider } from "@/components/AnimatedComponents";

export default function DashboardGeralPage() {
  return (
    <PageLayout className="pb-12">
      <PageHeader
        title="Dashboard Geral da Empresa"
      />
      
      <AsymmetricGrid className="mt-6">
        <WidgetCard>
          <ProducaoDiaWidget />
        </WidgetCard>
        <WidgetCard centered>
          <OEEWidget />
        </WidgetCard>
      </AsymmetricGrid>

      <ContentGrid cols={2} className="mt-6">
        <WidgetCard>
          <ProducaoSetorWidget />
        </WidgetCard>
        <WidgetCard>
          <MaquinaStatusWidget />
        </WidgetCard>
      </ContentGrid>

      <ContentGrid cols={2} className="mt-6">
        <WidgetCard>
          <TendendiaRefugoWidget />       
        </WidgetCard>
        <WidgetCard>
          <MotivosFrequentesWidget />    
        </WidgetCard>
      </ContentGrid>

      <KPIGrid cols={4} className="mt-4">
        <KPICardDecorated>
          <MediaParadasDiaWidget />
        </KPICardDecorated>
        <KPICardDecorated>
          <PecasPorMinutoWidget />
        </KPICardDecorated>
        <KPICardDecorated>
          <MaquinaAtivaPorTurnoWidget />
        </KPICardDecorated>
        <KPICardDecorated>
          <ProducaoPorTurnoLotesWidget />
        </KPICardDecorated>
      </KPIGrid>
    </PageLayout>
  );
}
