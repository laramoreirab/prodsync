"use client"

import { use } from "react";
import { Pencil, Trash2, ChevronDown } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
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
import { useEffect, useState } from "react";

// Layout geral
import { PageLayout } from "@/components/AnimatedComponents";

// Componentes de detalhe
import {
  DetailPageContainer,
  DetailBackLink,
  UserProfileCard,
  DetailSectionTitle,
  DetailActions,
  SectionHighlight,
  DetailWidgetGrid, DetailWidgetCard
} from "@/components/DetailComponents";


export default function ProducaoGestorPage({ params }) {
  const { id } = use(params);
  const gestorId = Number(id);
  const [setorId, setSetorId] = useState(null); //usei para ver 

  return (
    <PageLayout>
      <DetailPageContainer>

        {/* Voltar */}
        <DetailBackLink href="/adm/usuarios" label="Voltar para Usuários" />

        {/* Card de perfil do gestor */}
        <UserProfileCard
          imageSrc="/estevao.svg"
          name="Estevão Ferreira"
          fieldsLeft={[
            { label: "ID", value: "00000" },
            { label: "Email", value: "estevaozinho@gmail.com" },
            { label: "CPF", value: "443.651.730-65" },
          ]}
          fieldsRight={[
            { label: "Setor", value: "Engrenagens" },
            { label: "Função", value: "Gestor" },
            { label: "Turno", value: "Noite" },
          ]}
          actions={
            <DetailActions>
              <Dialog>
                <DialogTrigger className="text-[#122f60] cursor-pointer">
                  <Pencil size={32} />
                </DialogTrigger>
                <DialogContent>
                  <FormEdicaoUsuario />
                </DialogContent>
              </Dialog>

              <Dialog>
                <DialogTrigger className="text-[#b30000] cursor-pointer">
                  <Trash2 size={32} />
                </DialogTrigger>
                <DialogContent>
                  <FormExclusaoUsuario />
                </DialogContent>
              </Dialog>
            </DetailActions>
          }
        />

        {/* Seção de dados do setor gerenciado */}
        <DetailSectionTitle title="Dados do Setor que Gerencia" />

        <SectionHighlight>
          <OEEOperadorWidget operadorId={gestorId} />
        </SectionHighlight>

        <DetailWidgetGrid cols={2}>
          <DetailWidgetCard>
            <SetorProducaoSemanalWidget setorId={setorId} />
          </DetailWidgetCard>
          <DetailWidgetCard>
            <SetorTopOperadoresWidget setorId={setorId} />
          </DetailWidgetCard>
        </DetailWidgetGrid>

        <DetailWidgetGrid cols={2}>
          <DetailWidgetCard>
            <SetorMaquinaStatusWidget setorId={setorId} />
          </DetailWidgetCard>
          <DetailWidgetCard>
            <SetorProducaoMaquinaWidget setorId={setorId} />
          </DetailWidgetCard>
        </DetailWidgetGrid>

        <DetailWidgetGrid cols={2}>
          <DetailWidgetCard>
            <SetorMotivosParadaWidget setorId={setorId} />
          </DetailWidgetCard>
          <DetailWidgetCard>
            <SetorOEEEvolucaoWidget setorId={setorId} />
          </DetailWidgetCard>
        </DetailWidgetGrid>

      </DetailPageContainer>
    </PageLayout>
  );
}      