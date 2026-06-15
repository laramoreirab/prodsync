"use client";

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
import { PageLayout, PageHeader, WidgetCard, KPIGrid, ContentGrid, SectionDivider, LoadingState, AsymmetricGrid, KPICardDecorated } from "@/components/AnimatedComponents";
import { usePerfil } from "@/hooks/usePerfil";
import { ArrowUpFromLine } from "lucide-react";

export default function DashboardGeralGestor() {
  const { loading, setorId } = usePerfil();

  if (loading) {
    return <LoadingState message="Carregando dashboard..." />;
  }

  if (!setorId) {
    return (
      <PageLayout>
        <PageHeader
          title="Dashboard Geral do Setor"
          subtitle="Acompanhando os indicadores do seu setor..."
          action={
            <a href="/gestor/relatorios">
              <button className="bg-secondary-foreground px-4 py-1 rounded-md flex items-center text-white text-xl font-semibold cursor-pointer">
                <ArrowUpFromLine size={20} className="mr-2" />
                Exportar PDF
              </button>
            </a>
          }
        />
        <p className="text-sm text-destructive">
          Nenhum setor vinculado ao seu perfil.
        </p>
      </PageLayout>
    );
  }

  return (
    <PageLayout className="pb-12">
      <PageHeader
        title="Dashboard Geral"
        action={
          <a href="/gestor/relatorios">
            <button className="bg-secondary-foreground px-4 py-1 rounded-md flex items-center text-white text-xl font-semibold cursor-pointer">
              <ArrowUpFromLine size={20} className="mr-2" />
              Exportar PDF
            </button>
          </a>
        }
      />
      <AsymmetricGrid className="mt-6">
        <WidgetCard>
          <SetorProducaoDiariaWidget setorId={setorId} />
        </WidgetCard>
        <WidgetCard centered>
          <SetorOEEMedioWidget setorId={setorId} />
        </WidgetCard>
      </AsymmetricGrid>

      <ContentGrid cols={2} className="mt-6">
        <WidgetCard >
          <SetorOEEEvolucaoWidget setorId={setorId} />
        </WidgetCard>
        <WidgetCard>
          <SetorTopOperadoresWidget setorId={setorId} />
        </WidgetCard>
      </ContentGrid>

      <ContentGrid cols={2} className="mt-6">
        <WidgetCard>
          <SetorProducaoMaquinaWidget setorId={setorId} />
        </WidgetCard>
        <WidgetCard >
          <SetorStatusDonutWidget setorId={setorId} />
        </WidgetCard>
      </ContentGrid>

      <ContentGrid cols={2} className="mt-6">
        <WidgetCard>
          <SetorMotivosParadaWidget setorId={setorId} />
        </WidgetCard>
        <WidgetCard>
          <TendendiaRefugoWidget setorId={setorId} />
        </WidgetCard>
      </ContentGrid>

      <KPIGrid cols={4} className="mt-2">
        <KPICardDecorated>
          <MediaParadasDiaWidget setorId={setorId} />
        </KPICardDecorated>
        <KPICardDecorated>
          <PecasPorMinutoWidget setorId={setorId} />
        </KPICardDecorated>
        <KPICardDecorated>
          <MaquinaAtivaPorTurnoWidget setorId={setorId} />
        </KPICardDecorated>
        <KPICardDecorated>
          <ProducaoPorTurnoLotesWidget setorId={setorId} />
        </KPICardDecorated>
      </KPIGrid>
    </PageLayout>
  );
}
