"use client"

import Header from "@/components/ui/topbar";
import { MotivoRefugoMaquinaWidget } from "@/features/maquinas/MotivoRefugoMaquinaWidget";
import { MotivoSetupMaquinaWidget } from "@/features/maquinas/MotivoSetupMaquinaWidget";
import { OEEMaquinaWidget } from "@/features/maquinas/OEEMaquinaWidget";
import { OEEEvolucaoMaquinaWidget } from "@/features/maquinas/OEEEvolucaoMaquinaWidget";
import { VelocidadeMaquinaWidget } from "@/features/maquinas/VelocidadeMaquinaWidget";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
} from "@/components/ui/dialog";
import FormCriarApontamento from "@/components/ui/forms/maquinas/criarApontamento";

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

        <section id="infos_op" className="flex flex-col">
          <div className="flex justify-between items-center">
            <div className="bg-white px-5 pb-3 rounded-tl-4xl rounded-tr-4xl border border-t-gray-300 border-l-gray-300 border-r-gray-300 border-b-8 border-b-[#00357a]">
              <h1 className="text-3xl font-bold uppercase text-[#212e4b] pb-0 inline-block px-6 py-4">
                THAK-1234
              </h1>
            </div>

            <Dialog>
              <DialogTrigger className="bg-secondary-foreground px-4 py-1 rounded-md flex items-center text-white text-xl font-semibold cursor-pointer">
                <Plus className="mr-2" />
                Criar Apontamento
              </DialogTrigger>
              <DialogContent>
               <FormCriarApontamento />
              </DialogContent>
            </Dialog>
          </div>

          <div className="flex gap-8 mt-5">
            <div className="bg-white rounded-xl p-13  ">
              <Image src="/demo_maq.png" alt="Demo Maquina" className="rounded-xl" width={150} height={150} />
            </div>
            <div className="flex flex-col gap-6">
              <div className="flex items-center">
                <p className="text-xl font-semibold text-black mr-2">ID:</p>
                <p className="text-xl font-medium text-black">00000</p>
              </div>
              <div className="flex items-center">
                <p className="text-xl font-semibold text-black mr-2">Série:</p>
                <p className="text-xl font-medium text-black">SX-900</p>
              </div>
              <div className="flex items-center">
                <p className="text-xl font-semibold text-black mr-2">Velocidade Média:</p>
                <p className="text-xl font-medium text-black">40 peças/h </p>
              </div>
              <div className="flex items-center">
                <p className="text-xl font-semibold text-black mr-2">Status:</p>
                <p className="rounded-xl px-3 text-[#b30000] font-semibold bg-red-100">Parada</p>
              </div>
            </div>
          </div>
        </section>

        {/* Gráficos */}
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