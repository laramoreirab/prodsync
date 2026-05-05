"use client";

import { MaquinaOEEWidget } from "@/features/operador/MaquinaOEEWidget";

export default function MaquinaPage() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 pb-10">
      {/* OEE + Status */}
      <section className="bg-white border rounded-xl p-6">
        <MaquinaOEEWidget />
      </section>

      {/* Metas */}
      <section className="bg-white border rounded-xl p-6">
        <MetaProducaoWidget operadorId={operadorId} />
      </section>

      {/* Botões de ação */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button onClick={() => setSetupOpen(true)}>Registrar SetUp</button>
        <button onClick={() => setParadaOpen(true)}>Registrar Parada</button>
      </section>
    </div>
  );
}
