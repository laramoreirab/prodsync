import Header from "@/components/ui/topbar";
import { OEEOperadorWidget } from "@/features/operador/OEEOperadorWidget";
import { SetorOEEEvolucaoWidget } from "@/features/setores/SetorOEEEvolucaoWidget";
import { SetorTopOperadoresWidget } from "@/features/setores/SetorTopOperadoresWidget";
import { SetorMaquinaStatusWidget } from "@/features/setores/SetorMaquinaStatusWidget";
import { SetorMotivosParadaWidget } from "@/features/setores/SetorMotivosParadaWidget";
import { SetorProducaoSemanalWidget } from "@/features/setores/SetorProducaoSemanalWidget";
import { SetorProducaoMaquinaWidget } from "@/features/setores/SetorProducaoMaquinaWidget";

export default async function GestorDetalhePage({ params }) {
  const { id } = await params;
  const gestorId = Number(id);

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

      <div className="w-full max-w-5xl mt-8 pb-10 px-4 space-y-4">
        <div className="flex justify-start">
          <h1 className="text-4xl font-semibold text-black pb-0 inline-block">
            Gestor #{gestorId}
          </h1>
        </div>

        
        <section className="bg-white border-2 rounded-2xl p-4 shadow-sm">
          <OEEOperadorWidget operadorId={gestorId} />
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white border rounded-xl p-4 shadow-sm">
            <SetorProducaoSemanalWidget setorId={gestorId} />
          </div>
          <div className="bg-white border rounded-xl p-4 shadow-sm">
            <SetorTopOperadoresWidget setorId={gestorId} />
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white border rounded-xl p-4 shadow-sm">
            <SetorMaquinaStatusWidget setorId={gestorId} />
          </div>
          <div className="bg-white border rounded-xl p-4 shadow-sm">
            <SetorProducaoMaquinaWidget setorId={gestorId} />
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white border rounded-xl p-4 shadow-sm">
            <SetorMotivosParadaWidget setorId={gestorId} />
          </div>
          <div className="bg-white border rounded-xl p-4 shadow-sm">
            <SetorOEEEvolucaoWidget setorId={gestorId} />
          </div>
        </section>
      </div>
    </main>
  );
}