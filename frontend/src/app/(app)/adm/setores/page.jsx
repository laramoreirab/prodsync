import Header from "@/components/ui/topbar";

import { OEEPorSetorWidget } from "@/features/setores/OEEPorSetorWidget";
import { RefugoPorSetorWidget } from "@/features/setores/RefugoPorSetorWidget";
import { OEECriticoWidget } from "@/features/setores/OEECriticoWidget";
import { SetoresListaWidget } from "@/features/setores/SetoreslistaWidget";
import { SetorTotalWidget } from "@/features/setores/SetorTotalKPIWidget";
import { OperadoresMediaWidget } from "@/features/setores/OperadoresMediaKPIWidget";

export default function PageLayout() {
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
      <div className="w-full">
        <Header />
      </div>

      <div className="w-full max-w-6xl mt-[-800px] pt-0 pb-10 px-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex justify-start">
            <h1 className="text-4xl font-semibold text-black border-b-4 border-[var(--secondary-foreground)] pb-0 inline-block">
              Setores
            </h1>
          </div>

          <button className="flex items-center gap-2 h-10 px-4 rounded-xl bg-[#00357a] hover:bg-[#004aad] text-white text-sm font-medium transition-colors shadow-lg">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Criar Setor
          </button>
        </div>

        <div className="flex flex-col gap-4 p-4">

          {/* SEÇÃO 1 — KPIs de Topo (1/4, 1/4, 1/2) */}
          <section className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="sm:col-span-1 bg-white border border-gray-100 rounded-xl p-6 shadow-sm flex flex-col items-center justify-center">
              <SetorTotalWidget />
            </div>

            <div className="sm:col-span-1 bg-white border border-gray-100 rounded-xl p-6 shadow-sm flex flex-col items-center justify-center">
              <OperadoresMediaWidget />
            </div>

            <div className="sm:col-span-2 bg-white border border-gray-100 rounded-xl p-6 shadow-sm flex flex-col items-center justify-center">
              <OEEPorSetorWidget />
            </div>
          </section>

          {/* SEÇÃO 2 — Gráficos Principais (Refugo e Gauge) */}

          <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
              <RefugoPorSetorWidget />
            </div>

            <div className="md:col-span-1 bg-white border border-gray-100 rounded-xl p-6 shadow-sm flex flex-col items-center justify-center">
              <OEECriticoWidget />
            </div>
          </section>

          {/* SEÇÃO 3 — Tabela de Listagem Full Width */}
          <section className="bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-sm border border-gray-100">
            <SetoresListaWidget />
          </section>

        </div>
      </div>
    </main>
  );
}