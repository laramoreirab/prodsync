"use client";

import { PageLayout, PageHeader } from "@/components/AnimatedComponents";
import { DetailBackLink } from "@/components/DetailComponents";
import { RelatorioView } from "@/features/relatorios/RelatorioView";
import { usePerfil } from "@/hooks/usePerfil";

export default function RelatoriosGestorPage() {
  const { loading, setorId, setorNome } = usePerfil();

  if (loading) {
    return (
      <PageLayout className="pb-12">
        <PageHeader title="Relatórios" subtitle="Sincronizando perfil..." />
      </PageLayout>
    );
  }

  if (!setorId) {
    return (
      <PageLayout className="pb-12">
        <DetailBackLink href="/gestor" label="Voltar para Dashboard" />
        <PageHeader
          title="Relatórios"
          subtitle="Vincule um setor ao seu perfil para exportar o dashboard."
          className="!pt-0"
        />
        <p className="text-sm text-destructive">Nenhum setor vinculado ao seu perfil.</p>
      </PageLayout>
    );
  }

  return (
    <RelatorioView
      variant="gestor"
      setorId={setorId}
      setorNome={setorNome}
      dashboardHref="/gestor"
    />
  );
}
