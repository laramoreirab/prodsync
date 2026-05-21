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

import { PageLayout, PageHeader, WidgetCard, KPIGrid, ContentGrid } from "@/components/AnimatedComponents";

export default function DashboardGeralPage() {
  return (
    <PageLayout>
      <PageHeader title="Dashboard Geral da Empresa" />

      <ContentGrid cols={1}>
        <WidgetCard centered>
          <ProducaoDiaWidget />
        </WidgetCard>
      </ContentGrid>

      <ContentGrid cols={1} className="mt-6">
        <WidgetCard centered>
          <OEEWidget />
        </WidgetCard>
      </ContentGrid>

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
          <MotivosFrequentesWidget />
        </WidgetCard>
        <WidgetCard>
          <TendendiaRefugoWidget />
        </WidgetCard>
      </ContentGrid>

      <KPIGrid cols={4} className="mt-6 gap-6 lg:gap-8">
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
