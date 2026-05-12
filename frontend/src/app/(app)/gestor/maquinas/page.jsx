"use client";

import { useState, useEffect } from "react";
import { MaquinaStatusDonutWidget }  from "@/features/maquinas/MaquinaStatusDonutWidget";
import { MaquinasPorSetorWidget }    from "@/features/maquinas/MaquinasPorSetorWidget";
import { TempoMedioParadaWidget }    from "@/features/maquinas/TempoMedioParadaWidget";
import { ProducaoDefeitosWidget }    from "@/features/maquinas/ProducaoDefeitosWidget";
import { MaquinasPorTurnoWidget }    from "@/features/maquinas/MaquinasPorTurnoWidget";
import { ProducaoTotalWidget }       from "@/features/maquinas/ProducaoTotalWidget";

export default function MaquinasGestor() {
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
    <main className="min-h-screen bg-[url('/bg_app.svg')] bg-cover bg-fixed bg-center bg-no-repeat flex flex-col">
      <section className="p-8">
        <h1 className="underline decoration-secondary-foreground underline-offset-9 decoration-5 text-4xl font-semibold">
          Máquinas do Setor
        </h1>
      </section>

      <section className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border rounded-xl p-4 flex flex-col items-center justify-start h-full">
            <div className="w-full">
              <MaquinaStatusDonutWidget setorId={setorId} />
            </div>
          </div>
          <div className="bg-white border rounded-xl p-4">
            <MaquinasPorSetorWidget setorId={setorId} />
          </div>
          <div className="border bg-white rounded-xl p-4">
            <TempoMedioParadaWidget setorId={setorId} />
          </div>
        </div>
      </section>

      <section className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border bg-white rounded-xl p-4">
            <ProducaoDefeitosWidget setorId={setorId} />
          </div>
          <div className="border bg-white rounded-xl p-4">
            <MaquinasPorTurnoWidget setorId={setorId} />
          </div>
        </div>
      </section>

      <section className="p-6">
        <div className="border bg-white rounded-xl p-4">
          <ProducaoTotalWidget setorId={setorId} />
        </div>
      </section>
    </main>
  );
}