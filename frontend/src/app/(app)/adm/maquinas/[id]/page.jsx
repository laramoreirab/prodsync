
import Header from "@/components/ui/topbar";
import { MotivoRefugoMaquinaWidget }  from "@/features/maquinas/MotivoRefugoMaquinaWidget";
import { MotivoSetupMaquinaWidget }   from "@/features/maquinas/MotivoSetupMaquinaWidget";
import { OEEMaquinaWidget }           from "@/features/maquinas/OEEMaquinaWidget";
import { OEEEvolucaoMaquinaWidget }   from "@/features/maquinas/OEEEvolucaoMaquinaWidget";
import { VelocidadeMaquinaWidget }    from "@/features/maquinas/VelocidadeMaquinaWidget";

export default async function MaquinaDetalhePage({ params }) {
  const { id } = await params;
  const maquinaId = Number(id);

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
            Máquina #{maquinaId}
          </h1>
        </div>

        {/* SEÇÃO 1: Refugo + Setup */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white border rounded-xl p-4 shadow-sm">
            <MotivoRefugoMaquinaWidget maquinaId={maquinaId} />
          </div>
          <div className="bg-white border rounded-xl p-4 shadow-sm">
            <MotivoSetupMaquinaWidget maquinaId={maquinaId} />
          </div>
        </section>

        {/* SEÇÃO 2: OEE Gauges */}
        <section className="bg-white border-2 rounded-2xl p-4 shadow-sm">
          <OEEMaquinaWidget maquinaId={maquinaId} />
        </section>

        {/* SEÇÃO 3: Evolução OEE + Velocidade */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white border rounded-xl p-4 shadow-sm">
            <OEEEvolucaoMaquinaWidget maquinaId={maquinaId} />
          </div>
          <div className="bg-white border rounded-xl p-4 shadow-sm">
            <VelocidadeMaquinaWidget maquinaId={maquinaId} />
          </div>
        </section>

      </div>
    </main>
  );
}