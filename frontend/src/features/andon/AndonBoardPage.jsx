"use client";

import { useEffect, useState } from "react";
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
    <div className="mx-auto flex w-full flex-col gap-6 p-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <h1 className="inline-block border-b-4 border-secondary-foreground pb-1 text-3xl font-semibold text-slate-950 md:text-4xl">
          {content.pageTitle}
        </h1>

        <div className="flex items-end">
          <AndonRelogioWidget />
        </div>
      </div>

      <section className="grid gap-4 xl:grid-cols-4">
        <div className="xl:col-span-2 rounded-lg border border-slate-200 bg-white/95 p-5 shadow-sm md:p-6">
          <AndonStatusWidget scope={scope} idSetor={idSetor} title={content.statusTitle} />
        </div>

        <div className="xl:col-span-2 rounded-lg border border-slate-200 bg-white/95 p-5 shadow-sm md:p-6">
          <AndonRankingWidget scope={scope} idSetor={idSetor} />
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
