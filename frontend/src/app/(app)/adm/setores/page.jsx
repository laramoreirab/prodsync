import Header from "@/components/ui/topbar";

import { OEEPorSetorWidget } from "@/features/setores/OEEPorSetorWidget";
import { RefugoPorSetorWidget } from "@/features/setores/RefugoPorSetorWidget";
import { OEECriticoWidget } from "@/features/setores/OEECriticoWidget";
import { SetoresListaWidget } from "@/features/setores/SetoresListaWidget";

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

        {/* Div de agrupamento para o título de setores e botão */}
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

        {/* SEÇÃO 1 — KPIs Principais */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* <OEEPorSetorWidget /> */}
        </section>

        {/* SEÇÃO 2 — Gráficos de Refugo e Alertas */}
        <section className="grid grid-cols-1 md:grid-cols-[1fr_320px] gap-4">
          <RefugoPorSetorWidget />
          <OEECriticoWidget />
        </section>

        {/* SEÇÃO 3 — Tabela de Listagem */}
        <section className="bg-white/80 backdrop-blur-sm p-2 rounded-2xl shadow-sm border border-white/20">
          <SetoresListaWidget />
        </section>
      </div>
    </main>
  );
}