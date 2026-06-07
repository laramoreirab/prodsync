"use client";

import { MotivoRefugoMaquinaWidget } from "@/features/maquinas/MotivoRefugoMaquinaWidget";
import { MotivoSetupMaquinaWidget } from "@/features/maquinas/MotivoSetupMaquinaWidget";
import { OEEMaquinaWidget } from "@/features/maquinas/OEEMaquinaWidget";
import { OEEEvolucaoMaquinaWidget } from "@/features/maquinas/OEEEvolucaoMaquinaWidget";
import { VelocidadeMaquinaWidget } from "@/features/maquinas/VelocidadeMaquinaWidget";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import FormCriarApontamento from "@/components/ui/forms/maquinas/criarApontamento";
import { Plus, ChevronDown } from "lucide-react";
import { use, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { maquinaCrudService } from "@/services/maquinaCrudService";
import { Badge } from "@/components/ui/badge";
import {
  FadeUpItem,
  LoadingState,
  PageLayout,
} from "@/components/AnimatedComponents";
import {
  DetailPageContainer,
  DetailBackLink, MachineProfileCard, DetailActions
} from "@/components/DetailComponents";

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
    maquinaCrudService
      .getById(maquinaId)
      .then((resp) => setMaquina(resp?.dados || resp))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [maquinaId]);

  if (loading) {
    return <LoadingState message="Carregando máquina..." />;
  }

  const nome = maquina?.nome || `Máquina #${id}`;
  const imagem = maquina?.imagem || "/demo_maq.png";
  const status = maquina?.status_atual || maquina?.status || "-";
  const statusClass = statusConfig[status] || "bg-gray-100 text-gray-700";

  return (
<PageLayout>
    <DetailPageContainer>
      
      {/* Voltar para Dashboard */}
      <DetailBackLink href="/operador/" label="Voltar para a Dashboard" />
      
      {/* Perfil da Máquina padronizado */}
      <MachineProfileCard
        machineName={nome}
        imageSrc={imagem}
        fieldsLeft={[
          { 
            label: "ID", 
            value: String(maquina?.id_maquina || id).padStart(5, "0") 
          },
          { 
            label: "Série", 
            value: maquina?.serie || "-" 
          },
          { 
            label: "Capacidade", 
            value: maquina?.capacidade ? `${maquina.capacidade} peças/h` : "-" 
          },
        ]}
        fieldsRight={[
          {
            label: "Status",
            value: (
              <Badge
                variant="outline"
                className={`rounded-xl px-3 font-semibold border-none ${statusClass}`}
              >
                {status}
              </Badge>
            ),
          },
        ]}
        actions={
          <DetailActions>
            <Dialog>
              <DialogTrigger className="bg-secondary-foreground px-4 py-1 rounded-md flex items-center text-white text-xl font-semibold cursor-pointer gap-2">
                <Plus size={20} />
                Criar Apontamento
              </DialogTrigger>
              <DialogContent>
                <FormCriarApontamento id_maquina={maquinaId} />
              </DialogContent>
            </Dialog>
          </DetailActions>
        }
      />
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
      </DetailPageContainer>
    </PageLayout>
  );
}
