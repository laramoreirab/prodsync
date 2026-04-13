// src/app/DashboardGeralEmpresaADM/page.jsx
import { ProducaoSetorWidget } from "@features/producao/ProducaoSetorWidget";
import { ProducaoDiaWidget } from "@features/producao/ProducaoDiaWidget";
import { OEEWidget } from "@features/producao/OEEWidget";
import { MaquinaStatusWidget } from "@/features/maquinas/MaquinaStatusWidget";
// import { MotivosFrequentesWidget } from "@/features/paradas/schemas/paradasSchema";
import { MotivosFrequentesWidget } from "@/features/paradas/MotivosFrequentesParadas";
import { TendendiaRefugoWidget } from "@/features/refugo/TendenciaRefugoWidget";

export default function PageLayout() {
  return (
    <div className="min-h-screen bg-[#f8f8f8] flex justify-center py-10 px-4">
      {/* Container centralizado */}
      <div className="w-full max-w-6xl space-y-6">
        {/* SEÇÃO 1 */}
        <section className="bg-white p-6 rounded-2xl shadow-sm  gap-4">
          <div className="bg-white border rounded-xl p-4">
            <ProducaoDiaWidget />
          </div>

        </section>
        {/* SEÇÃO 2 */}
        <section className="bg-white p-6 rounded-2xl shadow-sm">
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
        <section className="bg-white p-6 rounded-2xl shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white border rounded-xl p-4">1</div>
            <div className="bg-white border rounded-xl p-4">2</div>
            <div className="bg-white border rounded-xl p-4">3</div>
            <div className="bg-white border rounded-xl p-4">4</div>
          </div>
        </section>
      </div>
    </div>
  );
}
