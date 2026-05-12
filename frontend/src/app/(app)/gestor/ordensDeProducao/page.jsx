"use client";

import { OPAtivasKPIWidget }     from "@/features/ordens/OPAtivasKPIWidget";
import { OPAtrasadasKPIWidget }  from "@/features/ordens/OPAtrasadasKPIWidget";
import { OPPecasBoasKPIWidget }  from "@/features/ordens/OPPecasBoasKPIWidget";
import { OPRefugoKPIWidget }     from "@/features/ordens/OPRefugoKPIWidget";
import { OPEficienciaWidget }    from "@/features/ordens/OPEficienciaWidget";
import { OPTopRefugoWidget }     from "@/features/ordens/OPTopRefugoWidget";
import { OPCargaSetorWidget }    from "@/features/ordens/OPCargaSetorWidget";
import { OPStatusWidget }        from "@/features/ordens/OPStatusWidget";
import { OPConcluidasDiaWidget } from "@/features/ordens/OPConcluidasDiaWidget";
import { useEffect, useState } from "react";

export default function OrdensDeProducaoGestor() {
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
    <main
      className="relative min-h-screen w-full flex flex-col items-center overflow-x-hidden"
      style={{
        backgroundImage: "url('/bg_app.svg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="w-full max-w-6xl mt-8 pb-10 px-4 space-y-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-4xl font-semibold text-black border-b-4 border-[var(--secondary-foreground)] pb-0 inline-block">
            Ordens de Produção
          </h1>
          <button className="flex items-center gap-2 h-10 px-4 rounded-xl bg-[var(--secondary-foreground)] hover:bg-[var(--azul-cobalto)] text-white text-sm font-medium transition-colors shadow-lg">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Nova OP
          </button>
        </div>

        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white border rounded-xl p-4 h-24"><OPAtivasKPIWidget setorId={setorId} /></div>
          <div className="bg-white border rounded-xl p-4 h-24"><OPAtrasadasKPIWidget setorId={setorId} /></div>
          <div className="bg-white border rounded-xl p-4 h-24"><OPPecasBoasKPIWidget setorId={setorId} /></div>
          <div className="bg-white border rounded-xl p-4 h-24"><OPRefugoKPIWidget setorId={setorId} /></div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white border rounded-xl p-6"><OPEficienciaWidget setorId={setorId} /></div>
          <div className="bg-white border rounded-xl p-6"><OPTopRefugoWidget setorId={setorId} /></div>
          <div className="bg-white border rounded-xl p-6"><OPCargaSetorWidget setorId={setorId} /></div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-white border rounded-xl p-6 md:col-span-2"><OPStatusWidget setorId={setorId} /></div>
          <div className="bg-white border rounded-xl p-6 md:col-span-3"><OPConcluidasDiaWidget setorId={setorId} /></div>
        </section>
      </div>
    </main>
  );
}
