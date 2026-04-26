import Header from "@/components/ui/topbar";
import { SetorMaquinaStatusWidget } from "@/features/setores/SetorMaquinaStatusWidget";
import { SetorOEEMedioWidget } from "@/features/setores/SetorOEEMedioWidget";
import { SetorOEEEvolucaoWidget } from "@/features/setores/SetorOEEEvolucaoWidget";
import { SetorTopOperadoresWidget } from "@/features/setores/SetorTopOperadoresWidget";
import { SetorMotivosParadaWidget } from "@/features/setores/SetorMotivosParadaWidget";

export default function SetorEspecificoPage({ params }) {
  const { id } = params;

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

      <div className="w-full max-w-6xl mt-8 pb-10 px-4 space-y-4">

        {/* TÍTULO */}
        <div className="flex justify-start mb-6">
          <h1 className="text-4xl font-semibold text-black border-b-4 border-[var(--secondary-foreground)] pb-0 inline-block">
            Setor
          </h1>
        </div>

        {/* SEÇÃO 1 — 2/3 Esquerda, 1/3 Direita */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 bg-white border rounded-xl p-6 shadow-sm">
            <SetorMaquinaStatusWidget setorId={id} />
          </div>
          <div className="md:col-span-1 bg-white border rounded-xl p-6 shadow-sm flex flex-col items-center justify-center">
            <SetorOEEMedioWidget setorId={id} />
          </div>
        </section>

        {/* SEÇÃO 2 — 2/3 Esquerda, 1/3 Direita */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 bg-white border rounded-xl p-6 shadow-sm">
            <SetorOEEEvolucaoWidget setorId={id} />
          </div>
          <div className="md:col-span-1 bg-white border rounded-xl p-6 shadow-sm">
            <SetorTopOperadoresWidget setorId={id} />
          </div>
        </section>

        {/* SEÇÃO 3 — INVERTIDO: 1/3 Esquerda, 2/3 Direita */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-1 bg-white border rounded-xl p-6 shadow-sm">
            <SetorMotivosParadaWidget setorId={id} />
          </div>
          <div className="md:col-span-2 bg-white border rounded-xl p-6 shadow-sm">
            <SetorOEEEvolucaoWidget setorId={id} />
          </div>
        </section>

      </div>
    </main>
  );
}