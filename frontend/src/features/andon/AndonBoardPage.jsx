"use client";
import { AndonRankingWidget } from "./AndonRankingWidget";
import { AndonRelogioWidget } from "./AndonRelogioWidget";
import { AndonSectionMarquee } from "./AndonSectionMarquee";
import { AndonStatusWidget } from "./AndonStatusWidget";
import { useAndonSections } from "./hooks/useAndonSections";
import { usePerfil } from "@/hooks/usePerfil";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { getUserFromToken } from "@/lib/auth";

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
  const [setorOperadorId, setSetorOperadorId] = useState(null);
  const [loadingSetorOperador, setLoadingSetorOperador] = useState(false);
  const [tentouResolverSetorOperador, setTentouResolverSetorOperador] = useState(false);
  const idSetor = scope === "sector" ? setorId ?? setorOperadorId : null;
  const content = scopeContent[scope] ?? scopeContent.factory;
  const aguardandoSetorOperador =
    scope === "sector" &&
    !loadingPerfil &&
    !setorId &&
    !setorOperadorId &&
    !tentouResolverSetorOperador;

  const { data: sections, loading, error } = useAndonSections(scope, idSetor);

  useEffect(() => {
    if (scope !== "sector" || loadingPerfil || setorId) return;

    let ativo = true;

    async function resolverSetorPelaMaquina() {
      const usuario = getUserFromToken();
      if (!usuario?.id_usuario) {
        if (ativo) setTentouResolverSetorOperador(true);
        return;
      }

      setLoadingSetorOperador(true);
      try {
        const resposta = await apiFetch(
          `/api/maquinas/obter-maquina-operador/${usuario.id_usuario}`,
        );
        const maquinaOperador = resposta?.dados ?? resposta;
        let idSetorMaquina =
          maquinaOperador?.id_setor ??
          maquinaOperador?.setor?.id_setor ??
          null;

        const idMaquina =
          maquinaOperador?.id_maquina ??
          maquinaOperador?.maquina?.id_maquina ??
          maquinaOperador?.id ??
          null;

        if (!idSetorMaquina && idMaquina) {
          const maquinaDetalhe = await apiFetch(`/api/maquinas/${idMaquina}`);
          const maquina = maquinaDetalhe?.dados ?? maquinaDetalhe;
          idSetorMaquina =
            maquina?.id_setor ??
            maquina?.setor?.id_setor ??
            null;
        }

        if (ativo) setSetorOperadorId(idSetorMaquina ? Number(idSetorMaquina) : null);
      } catch (error) {
        console.error("Erro ao resolver setor do operador para o Andon:", error);
      } finally {
        if (ativo) setTentouResolverSetorOperador(true);
        if (ativo) setLoadingSetorOperador(false);
      }
    }

    resolverSetorPelaMaquina();

    return () => {
      ativo = false;
    };
  }, [scope, loadingPerfil, setorId]);

  if (scope === "sector" && (loadingPerfil || loadingSetorOperador || aguardandoSetorOperador)) {
    return (
      <PageLayout>
        <PageHeader title={content.pageTitle} action={<AndonRelogioWidget />} />
        <FadeUpItem className="mt-6 rounded-lg border border-slate-200 bg-white-50 p-6 text-sm text-black-700">
          Sincronizando setor...
        </FadeUpItem>
      </PageLayout>
    );
  }

  if (scope === "sector" && !idSetor && !loadingSetorOperador) {
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
        <FadeUpItem className="mt-6 rounded-lg p-6 text-sm text-black-700">
          Sincronizando visão do Andon...
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
          <FadeUpItem key={section.id} className="mt-6 bg-white-50 p-6 text-sm text-black-700">

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
