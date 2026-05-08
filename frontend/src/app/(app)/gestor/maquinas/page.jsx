"use client";

import { useState, useEffect } from "react";
import { MaquinaStatusDonutWidget }  from "@/features/maquinas/MaquinaStatusDonutWidget";
import { MaquinasPorSetorWidget }    from "@/features/maquinas/MaquinasPorSetorWidget";
import { TempoMedioParadaWidget }    from "@/features/maquinas/TempoMedioParadaWidget";
import { ProducaoDefeitosWidget }    from "@/features/maquinas/ProducaoDefeitosWidget";
import { MaquinasPorTurnoWidget }    from "@/features/maquinas/MaquinasPorTurnoWidget";
import { ProducaoTotalWidget }       from "@/features/maquinas/ProducaoTotalWidget";

export default function MaquinasGestor() {
  return (
    <main className="min-h-screen bg-[url('/bg_app.svg')] bg-cover bg-fixed bg-center bg-no-repeat flex flex-col">
      <section className="p-8">
        <h1 className="underline decoration-secondary-foreground underline-offset-9 decoration-5 text-4xl font-semibold">
          Máquinas
        </h1>
      </section>

      <section className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border rounded-xl p-4 flex flex-col items-center justify-start h-full">
            <p className="text-sm font-semibold text-black self-start">Status Operacional das Máquinas</p>
            <p className="text-xs text-gray-400 font-semibold mt-1 self-start mb-2">*Atualizado em tempo real</p>
            <div className="w-full">
              <MaquinaStatusDonutWidget />
            </div>
          </div>
          <div className="bg-white border rounded-xl p-4">
            <MaquinasPorSetorWidget />
          </div>
          <div className="border bg-white rounded-xl p-4">
            <TempoMedioParadaWidget />
          </div>
        </div>
      </section>

      <section className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border bg-white rounded-xl p-4">
            <ProducaoDefeitosWidget />
          </div>
          <div className="border bg-white rounded-xl p-4">
            <MaquinasPorTurnoWidget />
          </div>
        </div>
      </section>

      <section className="p-6">
        <div className="border bg-white rounded-xl p-4">
          <ProducaoTotalWidget />
        </div>
      </section>
    </main>
  );
}