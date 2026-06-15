"use client";

import { useEffect, useState } from "react";
import { FileDown } from "lucide-react";
import { PageLayout, PageHeader, KPICardDecorated } from "@/components/AnimatedComponents";
import { DetailBackLink } from "@/components/DetailComponents";
import { Button } from "@/components/ui/button";
import { obterPerfil } from "@/services/authService";
import { ProducaoSetorWidget } from "@/features/producao/ProducaoSetorWidget";
import { ProducaoDiaWidget } from "@/features/producao/ProducaoDiaWidget";
import { OEEWidget } from "@/features/producao/OEEWidget";
import { MaquinaStatusWidget } from "@/features/maquinas/MaquinaStatusWidget";
import { MotivosFrequentesWidget } from "@/features/paradas/MotivosFrequentesParadas";
import { TendendiaRefugoWidget } from "@/features/refugo/TendenciaRefugoWidget";
import { MediaParadasDiaWidget } from "@/features/paradas/MediaParadasDiaWidget";
import { PecasPorMinutoWidget } from "@/features/producao/PecasPorMinutoWidget";
import { ProducaoPorTurnoLotesWidget } from "@/features/producao/ProducaoPorTurnoLotesWidget";
import { MaquinaAtivaPorTurnoWidget } from "@/features/maquinas/MaquinaAtivaPorTurnoWidget";
import { SetorProducaoDiariaWidget } from "@/features/setores/SetorProducaoDiariaWidget";
import { SetorOEEMedioWidget } from "@/features/setores/SetorOEEMedioWidget";
import { SetorOEEEvolucaoWidget } from "@/features/setores/SetorOEEEvolucaoWidget";
import { SetorTopOperadoresWidget } from "@/features/setores/SetorTopOperadoresWidget";
import { SetorMotivosParadaWidget } from "@/features/setores/SetorMotivosParadaWidget";
import { SetorProducaoMaquinaWidget } from "@/features/setores/SetorProducaoMaquinaWidget";
import { SetorStatusDonutWidget } from "@/features/setores/SetorStatusDonutWidget";
import { RELATORIO_VARIANTS } from "./relatorioSections";
import { useRelatorioSelecao } from "./useRelatorioSelecao";
import { exportRelatorioPdf } from "./exportRelatorioPdf";
import { RelatorioCustomizer } from "./components/RelatorioCustomizer";
import { EmpresaInfoSection } from "./components/EmpresaInfoSection";
import { SetoresResumoSection } from "./components/SetoresResumoSection";
import { EventosMaquinasSection } from "./components/EventosMaquinasSection";
import { RelatorioSection, RelatorioWidgetCard } from "./components/RelatorioSection";

export function RelatorioView({ variant, setorId = null, setorNome = null, dashboardHref }) {
  const config = RELATORIO_VARIANTS[variant];
  const {
    selecao,
    periodoEventos,
    setPeriodoEventos,
    toggle,
    toggleArea,
    selecionarTodos,
    limparTodos,
    ativos,
    total,
    estaAtivo,
  } = useRelatorioSelecao(variant);

  const [empresa, setEmpresa] = useState(null);
  const [carregandoEmpresa, setSincronizandoEmpresa] = useState(true);

  useEffect(() => {
    let ativo = true;
    obterPerfil()
      .then((dados) => {
        if (ativo) setEmpresa(dados);
      })
      .catch(() => {
        if (ativo) setEmpresa(null);
      })
      .finally(() => {
        if (ativo) setSincronizandoEmpresa(false);
      });
    return () => {
      ativo = false;
    };
  }, []);

  const nenhumaSecao = ativos === 0;

  return (
    <PageLayout className="pb-12 relatorio-pagina">
      <div data-print-hide className="space-y-4">
      <DetailBackLink href={dashboardHref} label="Voltar para Dashboard" />
      <PageHeader
        title={config.titulo}
        subtitle={config.subtitulo}
        className="[&>div:first-child]:gap-4 sm:[&>div:first-child]:gap-5 [&>div:first-child]:mt-1 !pt-0"
        action={
          <Button
            type="button"
            size="lg"
            className="h-auto gap-2.5 bg-secondary-foreground px-6 py-3 text-lg font-semibold text-white hover:bg-secondary-foreground/90"
            disabled={nenhumaSecao}
            onClick={exportRelatorioPdf}
          >
            <FileDown className="size-5" />
            Salvar como PDF
          </Button>
        }
      />
      </div>

      {nenhumaSecao ? (
        <p data-print-hide className="mb-4 text-sm text-destructive">
          Selecione ao menos uma seção para gerar o relatório.
        </p>
      ) : null}

      <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
        <RelatorioCustomizer
          areas={config.areas}
          selecao={selecao}
          periodoEventos={periodoEventos}
          onPeriodoEventosChange={setPeriodoEventos}
          onToggle={toggle}
          onToggleArea={toggleArea}
          onSelecionarTodos={selecionarTodos}
          onLimparTodos={limparTodos}
          ativos={ativos}
          total={total}
        />

        <div
          id="relatorio-documento"
          className="relatorio-documento min-w-0 flex-1 space-y-8 rounded-2xl border border-dashed border-gray-200/80 bg-white/40 p-4 sm:p-6 lg:p-8"
        >
          <div className="relatorio-marca flex items-center border-b border-gray-200/80 pb-5">
            <img
              src="/logo.png"
              alt="ProdSync"
              className="h-10 w-auto shrink-0 sm:h-12"
            />
          </div>

          {carregandoEmpresa ? (
            <p className="text-sm text-muted-foreground">Sincronizando dados da empresa...</p>
          ) : (
            <EmpresaInfoSection
              ativo={estaAtivo("empresa-info")}
              empresa={empresa}
              setorNome={setorNome}
              variant={variant}
            />
          )}

          {variant === "adm" ? (
            <RelatorioAdmConteudo
              estaAtivo={estaAtivo}
              periodoEventos={periodoEventos}
            />
          ) : (
            <RelatorioGestorConteudo
              estaAtivo={estaAtivo}
              setorId={setorId}
              periodoEventos={periodoEventos}
            />
          )}

          <footer className="relatorio-rodape border-t border-gray-200 pt-4 text-center text-xs text-muted-foreground">
            Documento gerado pelo ProdSync — uso interno da empresa.
          </footer>
        </div>
      </div>
    </PageLayout>
  );
}

function RelatorioAdmConteudo({ estaAtivo, periodoEventos }) {
  return (
    <>
      <SetoresResumoSection ativo={estaAtivo("setores-resumo")} />

      <EventosMaquinasSection
        ativo={estaAtivo("eventos-maquinas")}
        periodoDias={periodoEventos}
      />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <RelatorioSection
          id="producao-dia"
          ativo={estaAtivo("producao-dia")}
          titulo="Produção do dia"
          className="md:col-span-2"
        >
          <RelatorioWidgetCard>
            <ProducaoDiaWidget />
          </RelatorioWidgetCard>
        </RelatorioSection>

        <RelatorioSection id="oee" ativo={estaAtivo("oee")} titulo="OEE geral">
          <RelatorioWidgetCard centered>
            <OEEWidget />
          </RelatorioWidgetCard>
        </RelatorioSection>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <RelatorioSection id="producao-setor" ativo={estaAtivo("producao-setor")} titulo="Produção por setor">
          <RelatorioWidgetCard>
            <ProducaoSetorWidget />
          </RelatorioWidgetCard>
        </RelatorioSection>

        <RelatorioSection id="maquina-status" ativo={estaAtivo("maquina-status")} titulo="Status das máquinas">
          <RelatorioWidgetCard>
            <MaquinaStatusWidget />
          </RelatorioWidgetCard>
        </RelatorioSection>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <RelatorioSection id="tendencia-refugo" ativo={estaAtivo("tendencia-refugo")} titulo="Tendência de refugo">
          <RelatorioWidgetCard>
            <TendendiaRefugoWidget />
          </RelatorioWidgetCard>
        </RelatorioSection>

        <RelatorioSection id="motivos-paradas" ativo={estaAtivo("motivos-paradas")} titulo="Motivos de parada">
          <RelatorioWidgetCard>
            <MotivosFrequentesWidget />
          </RelatorioWidgetCard>
        </RelatorioSection>
      </div>

      <RelatorioSection id="kpi-grupo" ativo={kpiAlgumAtivo(estaAtivo)} titulo="Indicadores rápidos">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {estaAtivo("kpi-paradas") ? (
            <RelatorioSection id="kpi-paradas" ativo titulo="">
              <KPICardDecorated className="h-full shadow-none">
                <MediaParadasDiaWidget />
              </KPICardDecorated>
            </RelatorioSection>
          ) : null}
          {estaAtivo("kpi-pecas-min") ? (
            <RelatorioSection id="kpi-pecas-min" ativo titulo="">
              <KPICardDecorated className="h-full shadow-none">
                <PecasPorMinutoWidget />
              </KPICardDecorated>
            </RelatorioSection>
          ) : null}
          {estaAtivo("kpi-maquina-turno") ? (
            <RelatorioSection id="kpi-maquina-turno" ativo titulo="">
              <KPICardDecorated className="h-full shadow-none">
                <MaquinaAtivaPorTurnoWidget />
              </KPICardDecorated>
            </RelatorioSection>
          ) : null}
          {estaAtivo("kpi-producao-turno") ? (
            <RelatorioSection id="kpi-producao-turno" ativo titulo="">
              <KPICardDecorated className="h-full shadow-none">
                <ProducaoPorTurnoLotesWidget />
              </KPICardDecorated>
            </RelatorioSection>
          ) : null}
        </div>
      </RelatorioSection>
    </>
  );
}

function RelatorioGestorConteudo({ estaAtivo, setorId, periodoEventos }) {
  if (!setorId) {
    return (
      <p className="text-sm text-destructive">
        Nenhum setor vinculado ao seu perfil. Não é possível montar o relatório do setor.
      </p>
    );
  }

  return (
    <>
      <EventosMaquinasSection
        ativo={estaAtivo("eventos-maquinas")}
        periodoDias={periodoEventos}
        setorId={setorId}
      />
      <RelatorioSection id="producao-diaria" ativo={estaAtivo("producao-diaria")} titulo="Produção diária">
        <RelatorioWidgetCard>
          <SetorProducaoDiariaWidget setorId={setorId} />
        </RelatorioWidgetCard>
      </RelatorioSection>

      <RelatorioSection id="oee-medio" ativo={estaAtivo("oee-medio")} titulo="OEE médio do setor">
        <RelatorioWidgetCard>
          <SetorOEEMedioWidget setorId={setorId} />
        </RelatorioWidgetCard>
      </RelatorioSection>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <RelatorioSection id="oee-evolucao" ativo={estaAtivo("oee-evolucao")} titulo="Evolução do OEE">
          <RelatorioWidgetCard centered>
            <SetorOEEEvolucaoWidget setorId={setorId} />
          </RelatorioWidgetCard>
        </RelatorioSection>

        <RelatorioSection id="top-operadores" ativo={estaAtivo("top-operadores")} titulo="Top operadores">
          <RelatorioWidgetCard>
            <SetorTopOperadoresWidget setorId={setorId} />
          </RelatorioWidgetCard>
        </RelatorioSection>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <RelatorioSection id="producao-maquina" ativo={estaAtivo("producao-maquina")} titulo="Produção por máquina">
          <RelatorioWidgetCard>
            <SetorProducaoMaquinaWidget setorId={setorId} />
          </RelatorioWidgetCard>
        </RelatorioSection>

        <RelatorioSection id="status-donut" ativo={estaAtivo("status-donut")} titulo="Status das máquinas">
          <RelatorioWidgetCard>
            <SetorStatusDonutWidget setorId={setorId} />
          </RelatorioWidgetCard>
        </RelatorioSection>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <RelatorioSection id="motivos-parada-setor" ativo={estaAtivo("motivos-parada-setor")} titulo="Motivos de parada">
          <RelatorioWidgetCard>
            <SetorMotivosParadaWidget setorId={setorId} />
          </RelatorioWidgetCard>
        </RelatorioSection>

        <RelatorioSection id="tendencia-refugo" ativo={estaAtivo("tendencia-refugo")} titulo="Tendência de refugo">
          <RelatorioWidgetCard>
            <TendendiaRefugoWidget setorId={setorId} />
          </RelatorioWidgetCard>
        </RelatorioSection>
      </div>

      <RelatorioSection id="kpi-grupo-gestor" ativo={kpiAlgumAtivo(estaAtivo)} titulo="Indicadores rápidos">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {estaAtivo("kpi-paradas") ? (
            <RelatorioWidgetCard>
              <MediaParadasDiaWidget setorId={setorId} />
            </RelatorioWidgetCard>
          ) : null}
          {estaAtivo("kpi-pecas-min") ? (
            <RelatorioWidgetCard>
              <PecasPorMinutoWidget setorId={setorId} />
            </RelatorioWidgetCard>
          ) : null}
          {estaAtivo("kpi-maquina-turno") ? (
            <RelatorioWidgetCard>
              <MaquinaAtivaPorTurnoWidget setorId={setorId} />
            </RelatorioWidgetCard>
          ) : null}
          {estaAtivo("kpi-producao-turno") ? (
            <RelatorioWidgetCard>
              <ProducaoPorTurnoLotesWidget setorId={setorId} />
            </RelatorioWidgetCard>
          ) : null}
        </div>
      </RelatorioSection>
    </>
  );
}

function kpiAlgumAtivo(estaAtivo) {
  return (
    estaAtivo("kpi-paradas") ||
    estaAtivo("kpi-pecas-min") ||
    estaAtivo("kpi-maquina-turno") ||
    estaAtivo("kpi-producao-turno")
  );
}
