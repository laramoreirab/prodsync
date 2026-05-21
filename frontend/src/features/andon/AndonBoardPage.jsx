"use client";

import { useEffect, useState } from "react";
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
  const [idSetor, setIdSetor] = useState(null);
  const content = scopeContent[scope] ?? scopeContent.factory;

  useEffect(() => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const payload = JSON.parse(atob(token.split(".")[1]));
      setIdSetor(payload?.id_setor ?? payload?.idSetor ?? null);
    } catch {
      setIdSetor(null);
    }
  }, []);

  const { data: sections, loading, error } = useAndonSections(scope, idSetor);

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
