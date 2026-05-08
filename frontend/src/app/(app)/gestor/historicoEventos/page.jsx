import { ParadasComparadasWidget } from "@/features/eventos/ParadasComparadasWidget";
import { TopMotivosTempoWidget }   from "@/features/eventos/TopMotivosTempoWidget";

export default function HistoricoEventosGestor() {
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
      <div className="w-full max-w-6xl mt-8 pt-0 pb-10 px-4 space-y-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-4xl font-semibold text-black border-b-4 border-[var(--secondary-foreground)] pb-0 inline-block">
            Histórico de Eventos
          </h1>
          <button className="flex items-center gap-2 h-10 px-4 rounded-xl bg-[var(--secondary-foreground)] hover:bg-[var(--azul-cobalto)] text-white text-sm font-medium transition-colors shadow-lg">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Registrar Eventos
          </button>
        </div>

        <section className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white border rounded-xl p-4 md:col-span-1">
              <ParadasComparadasWidget />
            </div>
            <div className="bg-white border rounded-xl p-4 md:col-span-2">
              <TopMotivosTempoWidget />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}