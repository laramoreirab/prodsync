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

import { Plus, Search, EyeIcon, Pencil, Trash2, Loader2 } from "lucide-react";

import { PageLayout } from "@/components/AnimatedComponents";
import { DetailPageContainer, MachineProfileCard } from "@/components/DetailComponents";

import { use } from "react";
import Image from "next/image";

export default function MaquinaDetalhePage({ params }) {
  const { id } = use(params);
  const maquinaId = Number(id);

  return (
  <PageLayout padded={false}>
    <DetailPageContainer>

      <MachineProfileCard
        machineName="THAK-1234"
        imageSrc="/demo_maq.png"
        fieldsLeft={[
          { label: "ID", value: "00000" },
          { label: "Série", value: "SX-900" },
          { label: "Velocidade Média", value: "40 peças/h" },
        ]}
        fieldsRight={[
          {
            label: "Status",
            value: (
              <span className="rounded-xl px-3 text-[#b30000] font-semibold bg-red-100">
                Parada
              </span>
            ),
          },
        ]}
        actions={
          <Dialog>
            <DialogTrigger className="bg-secondary-foreground px-4 py-1 rounded-md flex items-center text-white text-xl font-semibold cursor-pointer">
              <Plus className="mr-2" />
              Criar Apontamento
            </DialogTrigger>
            <DialogContent>
              <FormCriarApontamento id_maquina={maquinaId} />
            </DialogContent>
          </Dialog>
        }
      />

        {/* Gráficos
        SEÇÃO 1: Refugo + Setup */}
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

</DetailPageContainer>
  </PageLayout>
  );
}