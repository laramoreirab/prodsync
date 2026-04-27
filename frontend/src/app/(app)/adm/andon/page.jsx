
import { AndonRelogioWidget } from "@/features/andon/AndonRelogioWidget";
import { AndonStatusWidget }  from "@/features/andon/AndonStatusWidget";
import { AndonRankingWidget } from "@/features/andon/AndonRankingWidget";

export default function AndonPage() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 pb-10">

      <div className="flex items-end ">
        <AndonRelogioWidget />
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

    </div>
  );
}