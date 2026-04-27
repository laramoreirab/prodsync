
import { AndonRelogioWidget } from "@/features/andon/AndonRelogioWidget";
import { AndonStatusWidget } from "@/features/andon/AndonStatusWidget";
import { AndonRankingWidget } from "@/features/andon/AndonRankingWidget";

export default function AndonPage() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 pb-10">

      <div className="flex flex-wrap justify-between p-8">
        <div className="mb-2 flex justify-start">
          <h1 className="inline-block border-b-4 border-[var(--secondary-foreground)] pb-0 text-4xl font-semibold text-black">
            Andon Geral da Fábrica
          </h1>
        </div>

        <div className="flex">
          <AndonRelogioWidget />
        </div>
      </div>

      {/* SEÇÃO 1*/}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white border rounded-xl p-6 shadow-sm">
          <AndonStatusWidget />
        </div>
        <div className="bg-white border rounded-xl p-6 shadow-sm">
          <AndonRankingWidget />
        </div>
      </section>

      <div className="flex items-center p-8 gap-5">
        <h1 className="text-2xl w-[125] font-semibold">Inventário de Máquinas</h1>
      </div>

      <section>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
          <div className="bg-white border rounded-xl p-4">
            THAK-909816
            <hr className="bg-green-600 w-full h-1" />
          </div>
          <div className="bg-white border rounded-xl p-4">
            
          </div>
          <div className="bg-white border rounded-xl p-4">
            
          </div>
          <div className="bg-white border rounded-xl p-4">
            
          </div>
        </div>
      </section>

    </div>
  );
}