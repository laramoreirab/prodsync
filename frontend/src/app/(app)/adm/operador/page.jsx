import Header from "@/components/ui/topbar";

// Widgets novos do operador
import { MetaProducaoWidget } from "@/features/operador/MetaProducaoWidget";
import { ParadasComparadasOperadorWidget } from "@/features/operador/ParadasComparadasOperadorWidget";

// Widgets que já existem mas precisam de versão para operador
import { OEEOperadorWidget } from "@/features/operador/OEEOperadorWidget";
import { PecasPorDiaWidget } from "@/features/operador/PecasPorDiaWidget";
import { ProducaoPorHoraOperadorWidget } from "@/features/operador/ProducaoPorHoraOperadorWidget";
import { EficienciaMaquinaWidget } from "@/features/operador/EficienciaMaquinaWidget";

// ID estático por enquanto — quando tiver auth, vem de lá
const OPERADOR_ID = 1;

export default function ProducaoOperadorPage() {
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
        <div className="flex justify-start">
          <h1 className="text-4xl font-semibold text-black pb-0 inline-block">
            Operador
          </h1>
        </div>

        {/* SEÇÃO 1  */}
        <section className="bg-white border-2 rounded-2xl p-6 shadow-sm">
          <OEEOperadorWidget operadorId={OPERADOR_ID} />
        </section>

        {/* SEÇÃO 2*/}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white border rounded-xl p-4 shadow-sm">
            <PecasPorDiaWidget operadorId={OPERADOR_ID} />
          </div>
          <div className="bg-white border rounded-xl p-4 shadow-sm">
            <ProducaoPorHoraOperadorWidget operadorId={OPERADOR_ID} />
          </div>
          <div className="bg-white border rounded-xl p-4 shadow-sm flex flex-col items-center justify-center">
            <MetaProducaoWidget operadorId={OPERADOR_ID} />
          </div>
        </section>

        {/* SEÇÃO 3*/}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white border rounded-xl p-4 shadow-sm">
            <ParadasComparadasOperadorWidget operadorId={OPERADOR_ID} />
          </div>
          <div className="bg-white border rounded-xl p-4 shadow-sm">
            <EficienciaMaquinaWidget operadorId={OPERADOR_ID} />
          </div>
        </section>

      </div>
    </main>
  );
}