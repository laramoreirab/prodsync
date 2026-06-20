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
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { maquinaCrudService } from "@/services/maquinaCrudService";
import { apiFetch } from "@/lib/api";
import { getUserFromToken } from "@/lib/auth";
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
  Produzindo: "bg-green-500/15 text-green-600 text-sm font-semibold border-none dark:!bg-green-300/20 dark:!text-green-100",
  Setup: "font-semibold text-sm bg-[#fffbea] text-amarelo dark:!bg-amber-300/20 dark:!text-amber-100",
  Parada: "font-semibold text-sm bg-vermelho-vivido/10 text-vermelho-vivido dark:!bg-red-500/20 dark:!text-red-100",
};

const resolverImagemMaquina = (imagem) => {
  if (!imagem) return "/demo_maq.png";
  if (imagem.startsWith("http")) return imagem;

  const apiUrl = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "");
  if (imagem.startsWith("/uploads/")) return `${apiUrl}${imagem}`;

  const nomeArquivo = imagem.replaceAll("\\", "/").split("/").pop();
  return `${apiUrl}/uploads/imagens/${nomeArquivo}`;
};

export default function MaquinaDetalhePage({ params }) {
  const { id } = use(params);
  const router = useRouter();
  const maquinaId = Number(id);
  const [maquina, setMaquina] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ativo = true;

    async function carregarMaquinaAutorizada() {
      setLoading(true);

      if (!Number.isInteger(maquinaId) || maquinaId <= 0) {
        router.replace("/operador/maquinas?semMaquina=1");
        return;
      }

      try {
        const usuario = getUserFromToken();

        if (usuario?.tipo === "Operador") {
          const resposta = await apiFetch(
            `/api/maquinas/obter-maquina-operador/${usuario.id_usuario}`,
          );
          const idMaquinaAutorizada = Number(
            resposta?.id_maquina ?? resposta?.dados?.id_maquina,
          );

          if (!idMaquinaAutorizada) {
            router.replace("/operador/maquinas?semMaquina=1");
            return;
          }

          if (idMaquinaAutorizada !== maquinaId) {
            router.replace(`/operador/maquinas/${idMaquinaAutorizada}`);
            return;
          }
        }

        const resp = await maquinaCrudService.getById(maquinaId);
        if (ativo) setMaquina(resp?.dados || resp);
      } catch (error) {
        console.error(error);
        router.replace("/operador/maquinas?semMaquina=1");
        return;
      }

      if (ativo) setLoading(false);
    }

    carregarMaquinaAutorizada();

    return () => {
      ativo = false;
    };
  }, [maquinaId, router]);

  if (loading) {
    return <LoadingState message="Sincronizando máquina..." />;
  }

  const nome = maquina?.nome || `Máquina #${id}`;
  const imagem = resolverImagemMaquina(maquina?.imagem);
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