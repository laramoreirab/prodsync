"use client";

import Header from "@/components/ui/topbar";
import { OEEOperadorWidget } from "@/features/operador/OEEOperadorWidget";
import { SetorOEEEvolucaoWidget } from "@/features/setores/SetorOEEEvolucaoWidget";
import { SetorTopOperadoresWidget } from "@/features/setores/SetorTopOperadoresWidget";
import { SetorMaquinaStatusWidget } from "@/features/setores/SetorMaquinaStatusWidget";
import { SetorMotivosParadaWidget } from "@/features/setores/SetorMotivosParadaWidget";
import { SetorProducaoSemanalWidget } from "@/features/setores/SetorProducaoSemanalWidget";
import { SetorProducaoMaquinaWidget } from "@/features/setores/SetorProducaoMaquinaWidget";
import { use, useEffect, useState } from "react";
import { usuariosCrudService } from "@/services/usuariosCrudService";

import {
  PageLayout, PageHeader, SectionDivider,
  StaggerWrapper, FadeUpItem, AnimatedTitle,
  KPIGrid, ContentGrid, WidgetCard,
  SearchBar, FilterRow, EmptyState, LoadingState,
  PageSection,
} from "@/components/AnimatedComponents";

// Componentes de detalhe
import {
  DetailPageContainer,
  DetailBackLink,
  UserProfileCard,
  DetailSectionTitle,
  DetailWidgetGrid,
  DetailWidgetCard,
  SectionHighlight,
  DetailListingSection,
  DetailActions,
} from "@/components/DetailComponents";


export default function GestorDetalhePage({ params }) {
  const { id } = use(params);
  const gestorId = Number(id);
  const [gestor, setGestor] = useState(null);
  const setorId = gestor?.id_setor || gestorId;

  useEffect(() => {
    usuariosCrudService.getById(gestorId)
      .then(setGestor)
      .catch((error) => console.error("Erro ao carregar gestor:", error));
  }, [gestorId]);

  return (
    <PageLayout>
      <DetailPageContainer>

        {/* Voltar */}
        <DetailBackLink href="/adm/gestor" label="Voltar para Gestores" />

        <div className="w-full"><Header /></div>

        <div className="w-full max-w-5xl mt-8 pb-10 px-4 space-y-4">
          <div className="flex justify-start">
            <h1 className="text-4xl font-semibold text-black pb-0 inline-block">
              {gestor?.nome || `Gestor #${gestorId}`}
            </h1>
          </div>


          <section className="bg-white border-2 rounded-2xl p-4 shadow-sm">
            <OEEOperadorWidget operadorId={gestorId} />
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white border rounded-xl p-4 shadow-sm">
              <SetorProducaoSemanalWidget setorId={setorId} />
            </div>
            <div className="bg-white border rounded-xl p-4 shadow-sm">
              <SetorTopOperadoresWidget setorId={setorId} />
            </div>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white border rounded-xl p-4 shadow-sm">
              <SetorMaquinaStatusWidget setorId={setorId} />
            </div>
            <div className="bg-white border rounded-xl p-4 shadow-sm">
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
        </div>
      </DetailPageContainer>
    </PageLayout>
  );
}
