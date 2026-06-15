"use client"

import { use, useCallback, useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import FormEdicaoUsuario from "@/components/ui/forms/usuarios/formEdicaoUsuario";
import FormExclusaoUsuario from "@/components/ui/forms/usuarios/formExclusaoUsuario";

import { OEEOperadorWidget } from "@/features/operador/OEEOperadorWidget";
import { SetorOEEEvolucaoWidget } from "@/features/setores/SetorOEEEvolucaoWidget";
import { SetorTopOperadoresWidget } from "@/features/setores/SetorTopOperadoresWidget";
import { SetorMaquinaStatusWidget } from "@/features/setores/SetorMaquinaStatusWidget";
import { SetorMotivosParadaWidget } from "@/features/setores/SetorMotivosParadaWidget";
import { SetorProducaoSemanalWidget } from "@/features/setores/SetorProducaoSemanalWidget";
import { SetorProducaoMaquinaWidget } from "@/features/setores/SetorProducaoMaquinaWidget";
import { usuariosCrudService } from "@/services/usuariosCrudService";
import Link from "next/link";
import { AnimatedTitle, LoadingState, PageLayout } from "@/components/AnimatedComponents";
import {
  DetailPageContainer,
  DetailBackLink,
  UserProfileCard,
  DetailActions,
} from "@/components/DetailComponents";


export default function GestorDetalhePage({ params }) {
  const { id } = use(params);
  const gestorId = Number(id);
  const [gestor, setGestor] = useState(null);
  const [carregando, setSincronizando] = useState(true);
  const setorId = gestor?.id_setor;

  const carregarDados = useCallback(() => {
    setSincronizando(true);
    return usuariosCrudService
      .getById(gestorId)
      .then(setGestor)
      .catch((error) => console.error("Erro ao carregar gestor:", error))
      .finally(() => setSincronizando(false));
  }, [gestorId]);

  useEffect(() => {
    carregarDados();
  }, [carregarDados]);

  const resolverImagemPerfil = (imagem) => {
    if (!imagem) return "/userdefault.svg";

    if (imagem.startsWith("http")) return imagem;

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
    if (imagem.startsWith("/uploads/")) return `${apiUrl}${imagem}`;

    return `${apiUrl}/uploads/imagens/${imagem}`;
  };

  if (carregando) {
    return <LoadingState message="Sincronizando dados do gestor..." />;
  }

  return (
    <PageLayout>
      <DetailPageContainer>
        <DetailBackLink href="/adm/usuarios" label="Voltar para Usuários" />
        <UserProfileCard
          imageSrc={resolverImagemPerfil(gestor?.imagem_perfil)}
          name={gestor?.nome || "Não informado"}
          fieldsLeft={[
            { label: "ID", value: String(gestor?.id_usuario || gestorId) },
            { label: "Email", value: gestor?.email || "Não informado" },
            { label: "Setor", value: gestor?.setor?.nome_setor || "Não informado" },
            ...(setorId
              ? [{
                  label: "",
                  value: (
                    <Link href={`/adm/setores/${setorId}`} className="text-blue-900 font-semibold hover:underline w-fit">
                      Ver setor gerenciado
                    </Link>
                  ),
                }]
              : []),
          ]}
        fieldsRight={[
          { label: "Função", value: gestor?.tipo || gestor?.funcao || "Não informado" },
          { label: "Turno", value: gestor?.turno?.nome_turno || "Não informado" },

        ]}
        actions={
          <DetailActions>
            <Dialog>
              <DialogTrigger className="text-(--pencil) cursor-pointer">
                <Pencil size={32} />
              </DialogTrigger>
              <DialogContent>
                <FormEdicaoUsuario usuarioId={gestorId} onEdicaoSucesso={carregarDados} />
              </DialogContent>
            </Dialog>
            <Dialog>
              <DialogTrigger className="text-(--trash) cursor-pointer">
                <Trash2 size={32} />
              </DialogTrigger>
              <DialogContent>
                <FormExclusaoUsuario usuarioId={gestorId} />
              </DialogContent>
            </Dialog>
          </DetailActions>
        }
        />
        <AnimatedTitle className="font-bold text-3xl mt-4">
          Indicadores do Setor Responsável
        </AnimatedTitle>

        <section className="bg-white border-2 rounded-2xl p-4 shadow-sm">
          <OEEOperadorWidget operadorId={gestorId} />
        </section>

        {
          setorId ? (
            <>
              <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white border rounded-xl p-4 shadow-sm">
                  <SetorProducaoSemanalWidget setorId={setorId} />
                </div>
                <div className="bg-white border rounded-xl p-4 shadow-sm">
                  <SetorTopOperadoresWidget setorId={setorId} />
                </div>
              </section>

              <section className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[300px]">
                <div className="bg-white border rounded-xl p-4 shadow-sm h-full flex flex-col [&>div]:h-full [&>div]:flex [&>div]:flex-col">
                  <SetorMaquinaStatusWidget setorId={setorId} />
                </div>
                <div className="bg-white border rounded-xl p-4 shadow-sm h-full">
                  <SetorProducaoMaquinaWidget setorId={setorId} />
                </div>
              </section>

              <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white border rounded-xl p-4 shadow-sm">
                  <SetorMotivosParadaWidget setorId={setorId} />
                </div>
                <div className="bg-white border rounded-xl p-4 shadow-sm">
                  <SetorOEEEvolucaoWidget setorId={setorId} />
                </div>
              </section>
            </>
          ) : (
            <p className="text-gray-600">Este gestor ainda não está vinculado a um setor.</p>
          )
        }

      </DetailPageContainer>
    </PageLayout>
  );
}
