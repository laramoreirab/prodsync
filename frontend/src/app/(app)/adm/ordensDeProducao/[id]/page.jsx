
"use client";

import { OPProgressoWidget }  from "@/features/ordens/OPProgressoWidget";
import { OPOEEDetalheWidget } from "@/features/ordens/OPOEEDetalheWidget";

export default function OPDetalhePage({ params }) {
  const opId = params.id;

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 pb-10">
      <div className="mb-2 flex justify-start">
        <h1 className="inline-block border-b-4 border-[var(--secondary-foreground)] pb-0 text-4xl font-semibold text-black">
          Ordem de Produção
        </h1>
      </div>

      {/* SEÇÃO 1: Info card + Progresso */}
      <section className="bg-white border rounded-xl p-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            
          </div>
          <div className="md:col-span-1">
            <OPProgressoWidget opId={opId} />
          </div>
        </div>
      </section>

      {/* SEÇÃO 2: OEE Gauges */}
      <section className="bg-white border rounded-xl p-6 shadow-sm">
        <OPOEEDetalheWidget opId={opId} />
      </section>
    </div>
  );
}