"use client"

import React from 'react';
import Header from "@/components/ui/topbar";
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

import { PageLayout, PageHeader, WidgetCard, KPIGrid } from "@/components/AnimatedComponents";

export default function DashboardGeralPage() {
return (
  <PageLayout>
    <PageHeader title="Dashboard Geral da Empresa" />

    {/* SEÇÃO 1 - Produção do Dia */}
    <WidgetCard>
      <ProducaoDiaWidget />
    </WidgetCard>

    {/* SEÇÃO 2 - Resumo OEE */}
    <WidgetCard className="flex items-center justify-around p-8">
      <OEEWidget />
    </WidgetCard>

    {/* SEÇÃO 3 - Produção por Setor e Status Máquinas */}
    <WidgetCard>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 border-r border-gray-100 pr-6">
          <ProducaoSetorWidget />
        </div>
        <div className="md:col-span-1 flex items-center justify-center">
          <MaquinaStatusWidget />
        </div>
      </div>
    </WidgetCard>

    {/* SEÇÃO 4 - Motivos e Tendência de Refugo */}
    <WidgetCard>
      <div className="grid grid-cols-1 md:grid-cols-6 gap-8">
        <div className="md:col-span-2 border-r border-gray-100 pr-6">
          <MotivosFrequentesWidget />
        </div>
        <div className="md:col-span-4">
          <TendendiaRefugoWidget />
        </div>
      </div>
    </WidgetCard>

    {/* SEÇÃO 5 - KPIs Inferiores */}
    <WidgetCard>
      <KPIGrid cols={4}>
        <div className="flex flex-col border-r border-gray-100 last:border-0 pr-4">
          <MediaParadasDiaWidget />
        </div>
        <div className="flex flex-col border-r border-gray-100 last:border-0 pr-4">
          <PecasPorMinutoWidget />
        </div>
        <div className="flex flex-col border-r border-gray-100 last:border-0 pr-4">
          <MaquinaAtivaPorTurnoWidget />
        </div>
        <div className="flex flex-col">
          <ProducaoPorTurnoLotesWidget />
        </div>
      </KPIGrid>
    </WidgetCard>

  </PageLayout>
);
}