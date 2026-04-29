"use client";

import { AndonRankingWidget } from "./AndonRankingWidget";
import { AndonRelogioWidget } from "./AndonRelogioWidget";
import { AndonSectionMarquee } from "./AndonSectionMarquee";
import { AndonStatusWidget } from "./AndonStatusWidget";
import { useAndonSections } from "./hooks/useAndonSections";

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
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 pb-10">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <h1 className="inline-block border-b-4 border-[var(--secondary-foreground)] pb-1 text-3xl font-semibold text-slate-950 md:text-4xl">
          {content.pageTitle}
        </h1>

        <div className="self-start rounded-full border border-slate-200 bg-white/95 px-4 py-2 shadow-sm">
          <AndonRelogioWidget />
        </div>
      </div>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,2fr)_320px]">
        <div className="rounded-lg border border-slate-200 bg-white/95 p-5 shadow-sm md:p-6">
          <AndonStatusWidget scope={scope} title={content.statusTitle} />
        </div>

        <div className="rounded-lg border border-slate-200 bg-white/95 p-5 shadow-sm md:p-6">
          <AndonRankingWidget scope={scope} />
        </div>
      </section>

      {loading ? (
        <section className="rounded-lg border border-slate-200 bg-white/80 p-6 text-sm text-slate-500">
          Carregando visão do Andon...
        </section>
      ) : null}

      {error ? (
        <section className="rounded-lg border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700">
          Erro ao carregar os setores do Andon.
        </section>
      ) : null}

      {!loading && !error
        ? sections.map((section, index) => (
            <AndonSectionMarquee
              key={section.id}
              reverse={scope === "factory" && index % 2 === 1}
              section={section}
            />
          ))
        : null}
    </div>
  );
}
