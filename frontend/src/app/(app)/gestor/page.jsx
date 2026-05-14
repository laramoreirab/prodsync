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
import { apiFetch } from "@/lib/api";

export default function DashboardGeralGestor() {
  const [setorId, setSetorId] = useState(null);

  useEffect( () => {
    const carregarDadosGestor = async () => {
    try {
        const resposta = await apiFetch('/api/setores/gestor')
        if(Array.isArray(resposta.dados) && resposta.dados.length > 0){
          setSetorId(resposta.dados[0].id_setor)
        }else{
        setSetorId(resposta.dados.id_setor)}
    } catch {
      console.log("Não foi possível obter setor do gestor", error)
    }
    }
  }, []);

  return (
    <div className="mx-auto flex w-full flex-col gap-4 pb-10">
      <div className="mb-2 flex justify-start">
        <h1 className="underline decoration-secondary-foreground underline-offset-9 decoration-5 text-4xl font-semibold">
          Dashboard Geral do Setor
        </h1>
        </div>

      <section className="w-full bg-white border rounded-xl p-6 shadow-sm">
        <SetorProducaoDiariaWidget setorId={setorId} />
      </section>

      <section className="w-full bg-white border rounded-xl p-6 shadow-sm">
        <SetorOEEMedioWidget setorId={setorId} />
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border rounded-xl p-6 shadow-sm">
          <SetorOEEEvolucaoWidget setorId={setorId} />
        </div>
        <div className="bg-white border rounded-xl p-6 shadow-sm">
          <SetorTopOperadoresWidget setorId={setorId} />
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border rounded-xl p-6 shadow-sm">
          <SetorProducaoMaquinaWidget setorId={setorId} />
        </div>
        <div className="bg-white border rounded-xl p-6 shadow-sm">
          <SetorStatusDonutWidget setorId={setorId} />
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2 bg-white border rounded-xl p-6 shadow-sm">
          <SetorMotivosParadaWidget setorId={setorId} />
        </div>
        <div className="lg:col-span-3 bg-white border rounded-xl p-6 shadow-sm">
          <TendendiaRefugoWidget setorId={setorId} />
        </div>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white border rounded-xl p-6 shadow-sm flex flex-col items-center justify-center min-h-[150px]">
          <MediaParadasDiaWidget />
        </div>
        <div className="bg-white border rounded-xl p-6 shadow-sm flex flex-col items-center justify-center min-h-[150px]">
          <PecasPorMinutoWidget />
        </div>
        <div className="bg-white border rounded-xl p-6 shadow-sm flex flex-col items-center justify-center min-h-[150px]">
          <MaquinaAtivaPorTurnoWidget />
        </div>
        <div className="bg-white border rounded-xl p-6 shadow-sm flex flex-col items-center justify-center min-h-[150px]">
          <ProducaoPorTurnoLotesWidget />
        </div>
      </section>
    </div>
  );
}