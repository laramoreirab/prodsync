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
import { PageLayout, PageHeader, WidgetCard, KPIGrid, ContentGrid, SectionDivider } from "@/components/AnimatedComponents";
import { usePerfil } from "@/hooks/usePerfil";
import { ArrowUpFromLine } from "lucide-react";


export default function DashboardGeralGestor() {
  const { loading, setorId } = usePerfil();

  if (loading) {
    return (
      <PageLayout>
        <PageHeader title="Dashboard Geral do Setor" subtitle="Acompanhando os indicadores do seu setor..." />
        <p className="text-sm text-muted-foreground">Carregando dados do setor...</p>
      </PageLayout>
    );
  }

  if (!setorId) {
    return (
      <PageLayout>
        <PageHeader
          title="Dashboard Geral do Setor" subtitle="Acompanhando os indicadores do seu setor..."
          action={
            <a href="/gestor/relatorios">
              <button className="bg-secondary-foreground px-4 py-1 rounded-md flex items-center text-white text-xl font-semibold cursor-pointer">
                <ArrowUpFromLine size={20} className="mr-2" />
                Exportar PDF
              </button>
            </a>
          }
        />
        <p className="text-sm text-destructive">Nenhum setor vinculado ao seu perfil.</p>

      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <PageHeader
        title="Dashboard Geral do Setor"
        subtitle="Visão completa da produtividade, eficiência e qualidade do setor."
        action={
          <a href="/gestor/relatorios">
            <button className="bg-secondary-foreground px-4 py-1 rounded-md flex items-center text-white text-xl font-semibold cursor-pointer">
              <ArrowUpFromLine size={20} className="mr-2" />
              Exportar PDF
            </button>
          </a>
        }
      />
      <SectionDivider title="Panorama do setor" className="mt-2" />
      <ContentGrid cols={1} className="mt-2">
        <WidgetCard>
          <SetorProducaoDiariaWidget setorId={setorId} />
        </WidgetCard>
      </ContentGrid>

      <ContentGrid cols={1} className="mt-6">
        <WidgetCard>
          <SetorOEEMedioWidget setorId={setorId} />
        </WidgetCard>
      </ContentGrid>

      <SectionDivider title="Eficiência e equipe" className="mt-6" />
      <ContentGrid cols={2} className="mt-2">
        <WidgetCard centered>
          <SetorOEEEvolucaoWidget setorId={setorId} />
        </WidgetCard>
        <WidgetCard>
          <SetorTopOperadoresWidget setorId={setorId} />
        </WidgetCard>
      </ContentGrid>

      <SectionDivider title="Ativos de produção" className="mt-6" />
      <ContentGrid cols={2} className="mt-2">
        <WidgetCard>
          <SetorProducaoMaquinaWidget setorId={setorId} />
        </WidgetCard>
        <WidgetCard>
          <SetorStatusDonutWidget setorId={setorId} />
        </WidgetCard>
      </ContentGrid>

      <SectionDivider title="Perdas e qualidade" className="mt-6" />
      <ContentGrid cols={2} className="mt-2">
        <WidgetCard>
          <SetorMotivosParadaWidget setorId={setorId} />
        </WidgetCard>
        <WidgetCard>
          <TendendiaRefugoWidget setorId={setorId} />
        </WidgetCard>
      </ContentGrid>

      <SectionDivider title="Indicadores rápidos" className="mt-6" />
      <KPIGrid cols={4} className="mt-2">
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
