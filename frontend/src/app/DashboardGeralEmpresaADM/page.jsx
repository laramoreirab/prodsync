// src/app/DashboardGeralEmpresaADM/page.jsx
import { ProducaoSetorWidget } from "@features/producao/ProducaoSetorWidget";
import { ProducaoDiaWidget } from "@features/producao/ProducaoDiaWidget";

export default function PageLayout() {
  return (
    <div className="min-h-screen bg-[#f8f8f8] flex justify-center py-10 px-4">
      {/* Container centralizado */}
      <div className="w-full max-w-6xl space-y-6">

        {/* SEÇÃO 1 */}
        <section className="bg-white p-6 rounded-2xl shadow-sm  gap-4">
          <div className="bg-white border rounded-xl p-4"><ProducaoDiaWidget /></div>
        </section>


        {/* SEÇÃO 2 */}
        <section className="bg-white p-6 rounded-2xl shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <div className="bg-white border rounded-xl p-4 md:col-span-1">
              Coluna 1
            </div>
            <div className="bg-white border rounded-xl p-4 md:col-span-1">
              Coluna 2
            </div>
            <div className="bg-white border rounded-xl p-4 md:col-span-1">
              Coluna 3
            </div>
            <div className="bg-white border rounded-xl p-4 md:col-span-3">
              Coluna maior (3x)
            </div>
          </div>
        </section>

        {/* SEÇÃO 3 */}
        <section className="bg-white p-6 rounded-2xl shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white border rounded-xl p-4 md:col-span-2">
              <ProducaoSetorWidget />
            </div>
            <div className="bg-white border rounded-xl p-4 md:col-span-1">
              1/3
            </div>
          </div>
        </section>

        {/* SEÇÃO 4 */}
        <section className="bg-white p-6 rounded-2xl shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <div className="bg-white border rounded-xl p-4 md:col-span-2">
              2/6
            </div>
            <div className="bg-white border rounded-xl p-4 md:col-span-4">
              4/6
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