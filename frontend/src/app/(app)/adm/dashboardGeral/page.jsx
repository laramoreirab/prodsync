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

      <div className="w-full max-w-6xl mt-8 pt-0 pb-10 px-4 space-y-4">
        <div className="flex justify-start mb-6">
          <h1 className="text-4xl font-semibold text-black border-b-4 border-[var(--secondary-foreground)] pb-0 inline-block">
            Dashboard Geral da Empresa
          </h1>
        </div>

      <section className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="rounded-xl border bg-white p-4">
          <ProducaoDiaWidget />
        </div>
      </section>

      <section className="rounded-2xl bg-white p-4 shadow-sm">
        <div className="flex w-full justify-evenly">
          <OEEWidget />
        </div>
      </section>

      <section className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-xl border bg-white p-4 md:col-span-2">
            <ProducaoSetorWidget />
          </div>
          <div className="rounded-xl border bg-white p-4 md:col-span-1">
            <MaquinaStatusWidget />
          </div>
        </div>
      </section>

      <section className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-6">
          <div className="h-[260px] rounded-xl border bg-white p-4 md:col-span-2">
            <MotivosFrequentesWidget />
          </div>
          <div className="rounded-xl border bg-white p-4 md:col-span-4">
            <TendendiaRefugoWidget />
          </div>
        </div>
      </section>

      <section>
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-4">
          <div className="rounded-xl border bg-white p-4">
            <MediaParadasDiaWidget />
          </div>
          <div className="rounded-xl border bg-white p-4">
            <PecasPorMinutoWidget />
          </div>
          <div className="rounded-xl border bg-white p-4">
            <MaquinaAtivaPorTurnoWidget />
          </div>
          <div className="rounded-xl border bg-white p-4">
            <ProducaoPorTurnoLotesWidget />
          </div>
        </div>
      </section>
    </div>
  );
}
