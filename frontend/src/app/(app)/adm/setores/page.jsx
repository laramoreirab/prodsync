import { RefugoPorSetorWidget } from "@/features/setores/RefugoPorSetorWidget";
import { OEECriticoWidget } from "@/features/setores/OEECriticoWidget";
import { SetoresListaWidget } from "@/features/setores/SetoresListaWidget";

export default function PageLayout() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 pb-10">
      <div className="flex items-center justify-between gap-4">
        <div className="flex justify-start">
          <h1 className="inline-block border-b-4 border-[var(--secondary-foreground)] pb-0 text-4xl font-semibold text-black">
            Setores
          </h1>
        </div>

        <button className="flex h-10 items-center gap-2 rounded-xl bg-[#00357a] px-4 text-sm font-medium text-white shadow-lg transition-colors hover:bg-[#004aad]">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Criar Setor
        </button>
      </div>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_320px]">
        <RefugoPorSetorWidget />
        <OEECriticoWidget />
      </section>

      <section className="rounded-2xl border border-white/20 bg-white/80 p-2 shadow-sm backdrop-blur-sm">
        <SetoresListaWidget />
      </section>
    </div>
  );
}
