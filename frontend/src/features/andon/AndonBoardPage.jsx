"use client";

import { AndonRankingWidget } from "./AndonRankingWidget";
import { AndonRelogioWidget } from "./AndonRelogioWidget";
import { AndonSectionMarquee } from "./AndonSectionMarquee";
import { AndonStatusWidget } from "./AndonStatusWidget";
import { useAndonSections } from "./hooks/useAndonSections";

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
  const content = scopeContent[scope] ?? scopeContent.factory;
  const { data: sections, loading, error } = useAndonSections(scope);

  return (
    <PageLayout>
      <PageHeader
        title={content.pageTitle}
        action={<AndonRelogioWidget />}
      />

      <ContentGrid cols={2} className="mt-2">
        <WidgetCard>
          <AndonStatusWidget scope={scope} title={content.statusTitle} />
        </WidgetCard>

        <WidgetCard>
          <AndonRankingWidget scope={scope} />
        </WidgetCard>
      </ContentGrid>

      {loading ? (
        <FadeUpItem className="mt-6 rounded-lg border border-slate-200 bg-white-50 p-6 text-sm text-black-700">
          Carregando visão do Andon...
        </FadeUpItem>
      ) : null}

      {error ? (
        <FadeUpItem className="mt-6 rounded-lg border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700">
          Erro ao carregar os setores do Andon.
        </FadeUpItem>
      ) : null}


      {/* ESPERO NAO TER QUEBRADO NADA MAS SE SIM ME AVISA */}
      {!loading && !error
        ? sections.map((section, index) => (
          <FadeUpItem className="mt-6 rounded-lg border border-slate-200 bg-white-50 p-6 text-sm text-black-700">

          <AndonSectionMarquee
            key={section.id}
            reverse={scope === "factory" && index % 2 === 1}
            section={section}
          />
          </FadeUpItem>
        ))
        : null}
    </PageLayout>
  );
}
