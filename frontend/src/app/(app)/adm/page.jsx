"use client"

import React from 'react';
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

import {
  PageLayout,
  PageHeader,
  KPIGrid,
  WidgetCard,
  ContentGrid,
  StaggerWrapper,
  FadeUpItem,
} from "@/components/AnimatedComponents";

export default function DashboardGeralPage() {
  return (
    <PageLayout>

      <PageHeader title="Dashboard Geral da Empresa" underline />

      {/* SEÇÃO 1 - Produção do Dia */}
      <FadeUpItem>
        <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
          <ProducaoDiaWidget />
        </div>
      </FadeUpItem>

      {/* SEÇÃO 2 - Resumo OEE */}
      <FadeUpItem>
        <div className="rounded-2xl bg-white p-8 shadow-sm border border-gray-100 flex items-center justify-around">
          <OEEWidget />
        </div>
      </FadeUpItem>

      {/* SEÇÃO 3 - Produção por Setor + Status Máquinas */}
      <FadeUpItem>
        <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 border-r border-gray-100 pr-6">
              <ProducaoSetorWidget />
            </div>
            <div className="md:col-span-1 flex items-center justify-center">
              <MaquinaStatusWidget />
            </div>
          </div>
        </div>
      </FadeUpItem>

      {/* SEÇÃO 4 - Motivos + Tendência de Refugo */}
      <FadeUpItem>
        <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-8">
            <div className="md:col-span-2 border-r border-gray-100 pr-6">
              <MotivosFrequentesWidget />
            </div>
            <div className="md:col-span-4">
              <TendendiaRefugoWidget />
            </div>
          </div>
        </div>
      </FadeUpItem>

      {/* SEÇÃO 5 - KPIs inferiores */}
      <FadeUpItem>
        <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
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
          </div>
        </div>
      </FadeUpItem>

    </PageLayout>
  );
}