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
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 pb-10">
      <div className="mb-2 flex justify-start">
        <h1 className="inline-block border-b-4 border-[var(--secondary-foreground)] pb-0 text-4xl font-semibold text-black">
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
