// src/app/DashboardGeralEmpresaADM/page.jsx
import Header from "@/components/ui/topbar";
import { ProducaoSetorWidget } from "@/features/producao/ProducaoSetorWidget";
import { ProducaoDiaWidget } from "@/features/producao/ProducaoDiaWidget";
import { OEEWidget } from "@/features/producao/OEEWidget";
import { MaquinaStatusWidget } from "@/features/maquinas/MaquinaStatusWidget";
import { MotivosFrequentesWidget } from "@/features/paradas/MotivosFrequentesParadas";
import { TendendiaRefugoWidget } from "@/features/refugo/TendenciaRefugoWidget";
import { MediaParadasDiaWidget } from "@/features/paradas/MediaParadasDiaWidget";
import { PecasPorMinutoWidget } from "@/features/producao/PecasPorMinutoWidget";
import { ProducaoPorTurnoLotesWidget } from "@/features/producao/ProducaoPorTurnoLotesWidget";
import { MaquinaAtivaPorTurnoWidget } from "@/features/maquinas/MaquinaAtivaPorTurnoWidget";

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

      <div className="w-full max-w-6xl mt-[800px] pt-0 pb-10 px-4 space-y-4">
        <div className="flex justify-start mb-6">
          <h1 className="text-4xl font-semibold text-black border-b-4 border-[var(--secondary-foreground)] pb-0 inline-block">
            Dashboard Geral da Empresa
          </h1>
        </div>

        {/* SEÇÃO 1 */}
        <section className="bg-white p-6 rounded-2xl shadow-sm">
          <div className="bg-white border rounded-xl p-4">
            <ProducaoDiaWidget />
          </div>
        </section>

        {/* SEÇÃO 2 */}
        <section className="bg-white p-4 rounded-2xl shadow-sm">
          <div className="w-full flex justify-evenly">
            <OEEWidget />
          </div>
        </section>

        {/* SEÇÃO 3 */}
        <section className="bg-white p-6 rounded-2xl shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white border rounded-xl p-4 md:col-span-2">
              <ProducaoSetorWidget />
            </div>
            <div className="bg-white border rounded-xl p-4 md:col-span-1">
              <MaquinaStatusWidget />
            </div>
          </div>
        </section>

        {/* SEÇÃO 4 */}
        <section className="bg-white p-6 rounded-2xl shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <div className="bg-white border rounded-xl p-4 md:col-span-2 h-[260px]">
              <MotivosFrequentesWidget />
            </div>
            <div className="bg-white border rounded-xl p-4 md:col-span-4">
              <TendendiaRefugoWidget />
            </div>
          </div>
        </section>

        {/* SEÇÃO 5 */}
        <section>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
            <div className="bg-white border rounded-xl p-4">
              <MediaParadasDiaWidget />
            </div>
            <div className="bg-white border rounded-xl p-4">
              <PecasPorMinutoWidget />
            </div>
            <div className="bg-white border rounded-xl p-4">
              <MaquinaAtivaPorTurnoWidget />
            </div>
            <div className="bg-white border rounded-xl p-4">
              <ProducaoPorTurnoLotesWidget />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
