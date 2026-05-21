"use client"

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
import { Plus, ChevronDown, Loader2 } from "lucide-react";
import { use, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { maquinaCrudService } from "@/services/maquinaCrudService";
import { Badge } from "@/components/ui/badge";

const statusConfig = {
  Produzindo: "bg-green-500/15 text-green-600",
  Setup: "bg-amber-100 text-amber-900",
  Parada: "bg-red-100 text-red-700",
};

export default function MaquinaDetalhePage({ params }) {
  const { id } = use(params);
  const maquinaId = Number(id);
  const [maquina, setMaquina] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!maquinaId) return;
    maquinaCrudService.getById(maquinaId)
      .then((resp) => setMaquina(resp?.dados || resp))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [maquinaId]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[url('/bg_app.svg')] bg-cover bg-fixed flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-blue-900" />
      </main>
    );
  }

  const nome = maquina?.nome || `Máquina #${id}`;
  const imagem = maquina?.imagem || "/demo_maq.png";
  const status = maquina?.status_atual || maquina?.status || "-";
  const statusClass = statusConfig[status] || "bg-gray-100 text-gray-700";

  return (
    <main className="min-h-screen bg-[url('/bg_app.svg')] bg-cover bg-fixed bg-center bg-no-repeat flex flex-col">
      <div className="w-full mt-8 pb-10 px-8 space-y-4">

        <Link className="flex items-center" href="/operador/maquinas">
          <ChevronDown className="mr-1 text-gray-500 inline-block transform -rotate-270" />
          <p className="text-xl font-semibold text-gray-800">Voltar para Máquinas</p>
        </Link>

        <section id="infos_maquina" className="flex flex-col">
          <div className="flex justify-between items-center">
            <div className="bg-white px-5 pb-3 rounded-tl-4xl rounded-tr-4xl border border-t-gray-300 border-l-gray-300 border-r-gray-300 border-b-8 border-b-[#00357a]">
              <h1 className="text-3xl font-bold uppercase text-[#212e4b] pb-0 inline-block px-6 py-4">
                {nome}
              </h1>
            </div>

            <Dialog>
              <DialogTrigger className="bg-secondary-foreground px-4 py-1 rounded-md flex items-center text-white text-xl font-semibold cursor-pointer">
                <Plus className="mr-2" />
                Criar Apontamento
              </DialogTrigger>
              <DialogContent>
                <FormCriarApontamento id_maquina={maquinaId} />
              </DialogContent>
            </Dialog>
          </div>

          <div className="flex gap-8 mt-5">
            <div className="bg-white rounded-xl p-13">
              <Image src={imagem} alt={nome} className="rounded-xl object-cover" width={150} height={150} />
            </div>
            <div className="flex flex-col gap-6">
              <div className="flex items-center">
                <p className="text-xl font-semibold text-black mr-2">ID:</p>
                <p className="text-xl font-medium text-black">{String(maquina?.id_maquina || id).padStart(5, "0")}</p>
              </div>
              <div className="flex items-center">
                <p className="text-xl font-semibold text-black mr-2">Série:</p>
                <p className="text-xl font-medium text-black">{maquina?.serie || "-"}</p>
              </div>
              <div className="flex items-center">
                <p className="text-xl font-semibold text-black mr-2">Capacidade:</p>
                <p className="text-xl font-medium text-black">{maquina?.capacidade ? `${maquina.capacidade} peças/h` : "-"}</p>
              </div>
              <div className="flex items-center">
                <p className="text-xl font-semibold text-black mr-2">Status:</p>
                <Badge variant="outline" className={`rounded-xl px-3 font-semibold border-none ${statusClass}`}>
                  {status}
                </Badge>
              </div>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white border rounded-xl p-4 shadow-sm">
            <MotivoRefugoMaquinaWidget maquinaId={maquinaId} />
          </div>
          <div className="bg-white border rounded-xl p-4 shadow-sm">
            <MotivoSetupMaquinaWidget maquinaId={maquinaId} />
          </div>
        </section>

        <section className="bg-white border-2 rounded-2xl p-4 shadow-sm">
          <OEEMaquinaWidget maquinaId={maquinaId} />
        </section>

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
