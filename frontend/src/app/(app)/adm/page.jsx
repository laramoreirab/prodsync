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

export default function DashboardGeralPage() {
  return (
     <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 pb-10">
        
        {/* Cabeçalho */}
        <div className="mb-2 flex justify-start">
          <h1 className="inline-block border-b-4 border-[var(--secondary-foreground)] pb-0 text-4xl font-semibold text-black">
            Dashboard Geral da Empresa
          </h1>
        </div>

        {/* SEÇÃO 1 - Produção do Dia (Destaque Largo) */}
        <section className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
          <div className="w-full">
            <ProducaoDiaWidget />
          </div>
        </section>

        {/* SEÇÃO 2 - Resumo OEE (Unificado e Espaçado) */}
        <section className="rounded-2xl bg-white p-8 shadow-sm border border-gray-100">
          <div className="w-full flex items-center justify-around">
            <OEEWidget />
          </div>
        </section>

        {/* SEÇÃO 3 - Produção por Setor e Status Máquinas (Grid 2/1) */}
        <section className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 border-r border-gray-100 pr-6">
              <ProducaoSetorWidget />
            </div>
            <div className="md:col-span-1 flex items-center justify-center">
              <MaquinaStatusWidget />
            </div>
          </div>
        </section>

        {/* SEÇÃO 4 - Motivos e Tendência de Refugo (Grid 1/2) */}
        <section className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-8">
            <div className="md:col-span-2 border-r border-gray-100 pr-6">
              <MotivosFrequentesWidget />
            </div>
            <div className="md:col-span-4">
              <TendendiaRefugoWidget />
            </div>
          </div>
        </section>

        {/* SEÇÃO 5 - KPIs Inferiores (Retangulares e Largos) */}
        <section className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
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
        </section>

      </div>
  );
}