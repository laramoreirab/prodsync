"use client";

import { SetorMaquinaStatusWidget }  from "@/features/setores/SetorMaquinaStatusWidget";
import { SetorOEEMedioWidget }       from "@/features/setores/SetorOEEMedioWidget";
import { SetorOEEEvolucaoWidget }    from "@/features/setores/SetorOEEEvolucaoWidget";
import { SetorTopOperadoresWidget }  from "@/features/setores/SetorTopOperadoresWidget";
import { SetorMotivosParadaWidget }  from "@/features/setores/SetorMotivosParadaWidget";
import { SetorProducaoSemanalWidget} from "@/features/setores/SetorProducaoSemanalWidget";
import { usePerfil } from "@/hooks/usePerfil";

export default function DashboardGeralGestor() {
  const { setorId } = usePerfil();

  return (
    <div className="mx-auto flex w-full flex-col gap-4 pb-10">
      <div className="mb-2 flex justify-start">
        <h1 className="underline decoration-secondary-foreground underline-offset-9 decoration-5 text-4xl font-semibold">
          Dashboard Geral do Setor
        </h1>
      </div>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 bg-white border rounded-xl p-6 shadow-sm">
          <SetorMaquinaStatusWidget setorId={setorId} />
        </div>
        <div className="md:col-span-1 bg-white border rounded-xl p-6 shadow-sm flex flex-col items-center justify-center">
          <SetorOEEMedioWidget setorId={setorId} />
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 bg-white border rounded-xl p-6 shadow-sm">
          <SetorProducaoSemanalWidget setorId={setorId} />
        </div>
        <div className="md:col-span-1 bg-white border rounded-xl p-6 shadow-sm">
          <SetorTopOperadoresWidget setorId={setorId} />
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-1 bg-white border rounded-xl p-6 shadow-sm">
          <SetorMotivosParadaWidget setorId={setorId} />
        </div>
        <div className="md:col-span-2 bg-white border rounded-xl p-6 shadow-sm">
          <SetorOEEEvolucaoWidget setorId={setorId} />
        </div>
      </section>
    </div>
  );
}
