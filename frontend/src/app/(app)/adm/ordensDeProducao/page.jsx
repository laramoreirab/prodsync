// src/app/(app)/adm/ordens/page.jsx
import Header from "@/components/ui/topbar";
import { OPAtivasKPIWidget }     from "@/features/ordens/OPAtivasKPIWidget";
import { OPAtrasadasKPIWidget }  from "@/features/ordens/OPAtrasadasKPIWidget";
import { OPPecasBoasKPIWidget }  from "@/features/ordens/OPPecasBoasKPIWidget";
import { OPRefugoKPIWidget }     from "@/features/ordens/OPRefugoKPIWidget";
import { OPEficienciaWidget }    from "@/features/ordens/OPEficienciaWidget";
import { OPTopRefugoWidget }     from "@/features/ordens/OPTopRefugoWidget";
import { OPCargaSetorWidget }    from "@/features/ordens/OPCargaSetorWidget";
import { OPStatusWidget }        from "@/features/ordens/OPStatusWidget";
import { OPConcluidasDiaWidget } from "@/features/ordens/OPConcluidasDiaWidget";

export default function OrdensDeProducaoPage() {
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
      <div className="w-full"><Header /></div>

      <div className="w-full max-w-6xl mt-8 pb-10 px-4 space-y-4">

        {/* TÍTULO */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-4xl font-semibold text-black border-b-4 border-[var(--secondary-foreground)] pb-0 inline-block">
            Ordens de Produção
          </h1>
          <button className="flex items-center gap-2 h-10 px-4 rounded-xl bg-[var(--secondary-foreground)] hover:bg-[#004aad] text-white text-sm font-medium transition-colors shadow-lg">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Nova OP
          </button>
        </div>

        {/*SEÇÃO 1: Graphs*/}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white border rounded-xl p-4"><OPAtivasKPIWidget /></div>
          <div className="bg-white border rounded-xl p-4"><OPAtrasadasKPIWidget /></div>
          <div className="bg-white border rounded-xl p-4"><OPPecasBoasKPIWidget /></div>
          <div className="bg-white border rounded-xl p-4"><OPRefugoKPIWidget /></div>
        </section>

        {/* SEÇÃO 2: Graphs*/}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white border rounded-xl p-6"><OPEficienciaWidget /></div>
          <div className="bg-white border rounded-xl p-6"><OPTopRefugoWidget /></div>
          <div className="bg-white border rounded-xl p-6"><OPCargaSetorWidget /></div>
        </section>

        {/* SEÇÃO 3: Graphs */}
        <section className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-white border rounded-xl p-6 md:col-span-2"><OPStatusWidget /></div>
          <div className="bg-white border rounded-xl p-6 md:col-span-3"><OPConcluidasDiaWidget /></div>
        </section>

      </div>
    </main>
  );
}