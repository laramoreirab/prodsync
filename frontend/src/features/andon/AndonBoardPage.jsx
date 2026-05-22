"use client";
import { AndonRankingWidget } from "./AndonRankingWidget";
import { AndonRelogioWidget } from "./AndonRelogioWidget";
import { AndonSectionMarquee } from "./AndonSectionMarquee";
import { AndonStatusWidget } from "./AndonStatusWidget";
import { useAndonSections } from "./hooks/useAndonSections";
import { usePerfil } from "@/hooks/usePerfil";

import {
  PageLayout,
  PageHeader,
  SectionDivider,
  StaggerWrapper,
  FadeUpItem,
  AnimatedTitle,
  ContentGrid,
  WidgetCard,
  LoadingState,
  EmptyState,
} from "@/components/AnimatedComponents";

const scopeContent = {
  factory: {
    pageTitle: "Andon Geral da Fábrica",
    statusTitle: "Status das Máquinas",
  },
  sector: {
    pageTitle: "Andon Geral do Setor",
    statusTitle: "Status das Máquinas do Setor",
  },
};

export function AndonBoardPage({ scope = "factory" }) {
  const { loading: loadingPerfil, setorId } = usePerfil();
  const idSetor = scope === "sector" ? setorId : null;
  const content = scopeContent[scope] ?? scopeContent.factory;

  const { data: sections, loading, error } = useAndonSections(scope, idSetor);

  if (scope === "sector" && loadingPerfil) {
    return (
      <PageLayout>
        <PageHeader title={content.pageTitle} action={<AndonRelogioWidget />} />
        <FadeUpItem className="mt-6 rounded-lg border border-slate-200 bg-white-50 p-6 text-sm text-black-700">
          Carregando setor...
        </FadeUpItem>
      </PageLayout>
    );
  }

  if (scope === "sector" && !idSetor) {
    return (
      <PageLayout>
        <PageHeader title={content.pageTitle} action={<AndonRelogioWidget />} />
        <FadeUpItem className="mt-6 rounded-lg border border-slate-200 bg-white-50 p-6 text-sm text-destructive">
          Nenhum setor vinculado ao seu perfil.
        </FadeUpItem>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <PageHeader
        title={content.pageTitle}
        action={<AndonRelogioWidget />}
      />

      <ContentGrid cols={2} className="mt-2">
        <WidgetCard>
          <AndonStatusWidget scope={scope} idSetor={idSetor} title={content.statusTitle} />
        </WidgetCard>

          <WidgetCard>
            <AndonRankingWidget scope={scope} idSetor={idSetor} />
          </WidgetCard>
      </ContentGrid>

      {loading ? (
        <FadeUpItem className="mt-6 rounded-lg border border-slate-200 bg-white p-6 text-sm text-black-700">
          Carregando visão do Andon...
        </FadeUpItem>
      ) : null}

      {error ? (
        <FadeUpItem className="mt-6 rounded-lg border border-slate-200 bg-white p-6 text-sm text-destructive">
          Erro ao carregar os setores do Andon.
        </FadeUpItem>
      ) : null}


      {/* ESPERO NAO TER QUEBRADO NADA MAS SE SIM ME AVISA */}
      {!loading && !error
        ? sections.map((section, index) => (
          <FadeUpItem key={section.id} className="mt-6 rounded-lg border border-slate-200 bg-white-50 p-6 text-sm text-black-700">

            <AndonSectionMarquee
              reverse={scope === "factory" && index % 2 === 1}
              section={section}
            />
          </FadeUpItem>
        ))
        : null}
    </PageLayout>
  );
}
