"use client";

import { MotivoRefugoMaquinaWidget } from "@/features/maquinas/MotivoRefugoMaquinaWidget";
import { MotivoSetupMaquinaWidget } from "@/features/maquinas/MotivoSetupMaquinaWidget";
import { OEEMaquinaWidget } from "@/features/maquinas/OEEMaquinaWidget";
import { OEEEvolucaoMaquinaWidget } from "@/features/maquinas/OEEEvolucaoMaquinaWidget";
import { VelocidadeMaquinaWidget } from "@/features/maquinas/VelocidadeMaquinaWidget";

import { use, useState, useEffect } from "react";
import {
  Plus,
  Loader2,
  Search,
  ChevronDown,Pencil,
  Trash2,
  EyeIcon,
  BellRing,
} from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { DataEvento } from "@/components/ui/dataEvento";
import { DuracaoEvento } from "@/components/ui/duracaoEvento";

import OrdenarDropdown from "@/components/ui/OrdenarDropdown";
import FilterDropdown from "@/components/ui/FilterDropdown";

import TableListagens from "@/components/table";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

import FormCadastroEvento from "@/components/ui/forms/historicoEventos/formCadastroEvento";
import DetalhesEvento from "@/components/ui/forms/historicoEventos/modalDetalhesEvento";
import { SolicitarJustificativaMenuItem } from "@/components/ui/forms/historicoEventos/solicitarJustificativaDialog";
import FormEdicaoEvento from "@/components/ui/forms/historicoEventos/formEdicaoEvento";
import FormExclusaoMaquina from "@/components/ui/forms/maquinas/formExclusaoMaquina";
import FormEdicaoMaquina from "@/components/ui/forms/maquinas/formEdicaoMaquina";
import { maquinaCrudService } from "@/services/maquinaCrudService";
import { apiFetch } from "@/lib/api";
import { filtrarPorDuracaoMax, filtrarPorNumberRange } from "@/lib/filterUtils";
import SyncPlacaDialog from "@/components/ui/forms/maquinas/SyncPlacaDialog";

// Layout geral
import {
  PageLayout,
  SearchBar,
  FilterRow,
  EmptyState,
  LoadingState,
} from "@/components/AnimatedComponents";

// Componentes de detalhe
import {
  DetailPageContainer,
  DetailBackLink,
  DetailSectionTitle,
  DetailWidgetGrid,
  DetailWidgetCard,
  SectionHighlight,
  DetailListingSection,
  ListingTabs,
  DetailActions,
  MachineProfileCard,
  StatusBadge,
} from "@/components/DetailComponents";

const colunasMaquina = [
  {
    id: "numero_evento",
    key: "numero_evento",
    label: "ID",
    className: "w-20 text-center justify-center",
  } /* id da máquina */,
  {
    id: "tipo",
    key: "tipoEvento",
    label: "Tipo",
    className: "text-center justify-center",
    icone: (valor) => {
      const config = {
        Setup: { variant: "setup" },
        Parada: { variant: "parada" },
      };

      const estilo = config[valor] || { variant: "outline", className: "" };
      return (
        <Badge
          variant={estilo.variant}
          className={`whitespace-nowrap ${estilo.className}`}
        >
          {valor}
        </Badge>
      );
    },
  },
  {
    id: "data",
    key: "data",
    label: "Data (Início - Fim)",
    icone: (valor, row) => <DataEvento inicio={row.inicio} fim={row.fim} />,
  },
  {
    id: "duracao",
    key: "duracao",
    label: "Duração",
    icone: (valor, row) => <DuracaoEvento inicio={row.inicio} fim={row.fim} />,
  },
  { id: "motivo", key: "motivo", label: "Motivo" },
  { id: "observacao", key: "observacao", label: "Observação" },
];

const colunasApontamento = [
  {
    id: "id",
    key: "id",
    label: "ID",
    className: "w-20 text-center justify-center",
  },
  {
    id: "op",
    key: "op",
    label: "OP Afetada",
    className: "w-30 text-center justify-center pl-5",
  },
  {
    id: "data",
    key: "data",
    label: "Data (Início - Fim)",
    className: "pl-10",
    icone: (valor, row) => <DataEvento inicio={row.inicio} fim={row.fim} />,
  },
  {
    id: "produzido",
    key: "produzido",
    label: "Produzido",
    className: "text-center justify-center",
    icone: (valor) => {
      return (
        <Badge
          variant="outline"
          className="bg-green-500/15 text-green-600 text-sm font-semibold border-none"
        >
          {valor}
        </Badge>
      );
    },
  },
  {
    id: "refugo",
    key: "refugo",
    label: "Refugo",
    className: "text-center justify-center",
    icone: (valor) => {
      return (
        <Badge
          variant="destructive"
          className="font-semibold text-sm border-none"
        >
          {valor}
        </Badge>
      );
    },
  },
  { id: "observacao", key: "observacao", label: "Observação" },
];

export default function MaquinaDetalheGestor({ params }) {
  const { id } = use(params);
  const maquinaId = Number(id);
  const [maquina, setMaquina] = useState(null);
  const [dados, setDados] = useState([]);
  const [dadosApontamentoState, setDadosApontamentoState] = useState([]);
  const [todosEventos, setTodosEventos] = useState([]);
  const [todosApontamentos, setTodosApontamentos] = useState([]);
  const [loadingMaquina, setLoadingMaquina] = useState(true);
  const [activeListTab, setActiveListTab] = useState("eventos");

  const imagemMaquina = (() => {
    const apiUrl = (
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"
    ).replace(/\/$/, "");
    if (!maquina?.imagem) return "/demo_maq.png";
    const imagem = String(maquina.imagem).replaceAll("\\", "/");
    if (imagem.startsWith("http")) return imagem;
    if (imagem.startsWith("/uploads/")) return `${apiUrl}${imagem}`;
    const nomeArquivo = imagem.split("/").pop();
    return `${apiUrl}/uploads/imagens/${nomeArquivo}`;
  })();

  const formatarData = (valor) => {
    if (!valor) return "-";
    return new Date(valor).toLocaleDateString("pt-BR");
  };

  const formatarPeriodo = (inicio, fim) => {
    if (!inicio) return "-";
    const dataInicio = new Date(inicio);
    const dataFim = fim ? new Date(fim) : null;
    const data = dataInicio.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
    });
    const horaInicio = dataInicio.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
    const horaFim = dataFim
      ? dataFim.toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "--:--";
    return `${data} (${horaInicio} - ${horaFim})`;
  };

  const formatarDuracao = (minutos) => {
    const totalSegundos = Math.max(0, Math.round((Number(minutos) || 0) * 60));
    const horas = Math.floor(totalSegundos / 3600);
    const mins = Math.floor((totalSegundos % 3600) / 60);
    const segs = totalSegundos % 60;
    return `${String(horas).padStart(2, "0")}:${String(mins).padStart(2, "0")}:${String(segs).padStart(2, "0")}`;
  };

  useEffect(() => {
    async function carregarMaquina() {
      setLoadingMaquina(true);
      try {
        const [respostaMaquina, respostaHistorico] = await Promise.all([
          maquinaCrudService.getById(maquinaId),
          apiFetch(`/api/maquinas/${maquinaId}/historico-eventos`),
        ]);

        setMaquina(respostaMaquina.dados || respostaMaquina);
        const historico = respostaHistorico.dados || [];
        const eventos = historico
          .filter((item) => item.tipo !== "Producao")
          .map((item) => ({
            ...item,
            tipoEvento: item.tipo === "Setup" ? "Setup" : "Parada",
            data: formatarPeriodo(item.inicio, item.fim),
            duracao: formatarDuracao(item.duracao_minutos),
            motivo: item.motivo || "Não Justificado",
          }));
        const apontamentos = historico
          .filter((item) => item.tipo === "Producao")
          .map((item) => ({
            ...item,
            id_ordem: item.ordem_producao?.id_ordem,
            op:
              item.ordem_producao?.codigo_lote ||
              item.ordem_producao?.id_ordem ||
              "-",
            data: formatarPeriodo(item.inicio, item.fim),
            duracao: formatarDuracao(item.duracao_minutos),
            produzido: String(item.produzido || 0),
            refugo: String(item.refugo || 0),
            observacao: item.observacao || "Sem observação",
          }));

        setTodosEventos(eventos);
        setDados(eventos);
        setTodosApontamentos(apontamentos);
        setDadosApontamentoState(apontamentos);
      } finally {
        setLoadingMaquina(false);
      }
    }

    if (maquinaId) {
      carregarMaquina();
    }
  }, [maquinaId]);

  const [buscaEvento, setBuscaEvento] = useState("");
  const [buscaApontamento, setBuscaApontamento] = useState("");

  const parseData = (dataStr) => {
    const [dataParte] = dataStr.split(" ");
    const [dia, mes] = dataParte.split("/");

    // ano fixo (ajuste se precisar)
    return new Date(`2025-${mes}-${dia}`);
  };

  // -------------------------------------------------------------------------------------------------- Eventos --------------------------------------------------------------------------------------------------
  const opcoesOrdenacaoEventos = [
    { label: "ID Crescente", value: "id_asc" },
    { label: "ID Decrescente", value: "id_desc" },
    { label: "Data Crescente", value: "data_asc" },
    { label: "Data Decrescente", value: "data_desc" },
    { label: "Duração Crescente", value: "duracao_asc" },
    { label: "Duração Decrescente", value: "duracao_desc" },
  ];

  //lógica de ordenação de Eventos
  const handleSortEventos = (criterio) => {
    const dadosCopiados = [...dados];

    dadosCopiados.sort((a, b) => {
      if (criterio === "id_asc") return Number(a.numero_evento) - Number(b.numero_evento);
      if (criterio === "id_desc") return Number(b.numero_evento) - Number(a.numero_evento);

      if (criterio === "data_asc") return parseData(a.data) - parseData(b.data);
      if (criterio === "data_desc")
        return parseData(b.data) - parseData(a.data);

      if (criterio === "duracao_asc") {
        const [hA, mA] = a.duracao.split(":").map(Number);
        const [hB, mB] = b.duracao.split(":").map(Number);
        return hA * 60 + mA - (hB * 60 + mB);
      }

      if (criterio === "duracao_desc") {
        const [hA, mA] = a.duracao.split(":").map(Number);
        const [hB, mB] = b.duracao.split(":").map(Number);
        return hB * 60 + mB - (hA * 60 + mA);
      }

      return 0;
    });

    setDados(dadosCopiados);
  };

  //filtros para eventos
  const eventosFilter = [
    {
      id: "tipoEvento",
      label: "Tipo",
      type: "checkbox",
      options: ["Parada", "Setup"],
    },
    { id: "data", label: "Data", type: "date-range" },
    { id: "duracao", label: "Duração máx.", type: "time-max" },
  ];

  const aplicarFiltrosEventos = (filtrosSelecionados) => {
    let dadosFiltrados = [...todosEventos];

    // filtro por status
    if (filtrosSelecionados.tipoEvento?.length) {
      dadosFiltrados = dadosFiltrados.filter((evento) =>
        filtrosSelecionados.tipoEvento.includes(evento.tipoEvento),
      );
    }

    // filtro por data
    if (filtrosSelecionados.data) {
      if (filtrosSelecionados.data.start) {
        dadosFiltrados = dadosFiltrados.filter(
          (evento) =>
            parseData(evento.data) >= new Date(filtrosSelecionados.data.start),
        );
      }

      if (filtrosSelecionados.data.end) {
        dadosFiltrados = dadosFiltrados.filter(
          (evento) =>
            parseData(evento.data) <= new Date(filtrosSelecionados.data.end),
        );
      }
    }

    if (filtrosSelecionados.duracao?.max) {
      dadosFiltrados = filtrarPorDuracaoMax(
        dadosFiltrados.map((e) => ({
          ...e,
          inicio: e.inicio ?? parseData(e.data),
          fim: e.fim,
        })),
        filtrosSelecionados.duracao.max,
      );
    }

    setDados(dadosFiltrados);
  };

  //filtra os dados atuais de EVENTOS (filtrados e ordenados) pelo termo de busca
  const dadosExibidos = dados.filter((evento) => {
    const termo = buscaEvento.toLowerCase();

    return (
      (evento.tipoEvento?.toLowerCase() || "").includes(termo) ||
      (evento.motivo?.toLowerCase() || "").includes(termo) ||
      evento.numero_evento?.toString().includes(termo) ||
      evento.id?.toString().includes(termo)
    );
  });

  // -------------------------------------------------------------------------------------------------- Apontamentos  --------------------------------------------------------------------------------------------------
  const opcoesOrdenacaoApontamento = [
    { label: "ID Crescente", value: "id_asc" },
    { label: "ID Decrescente", value: "id_desc" },
    { label: "OP Afetada Crescente", value: "opAfetada_asc" },
    { label: "OP Afetada Decrescente", value: "opAfetada_desc" },
    { label: "Produzido Crescente", value: "produzido_asc" },
    { label: "Produzido Decrescente", value: "produzido_desc" },
    { label: "Refugo Crescente", value: "refugo_asc" },
    { label: "Refugo Decrescente", value: "refugo_desc" },
  ];

  //lógica de ordenação de Apontamentos
  const handleSortApontamento = (criterio) => {
    const dadosCopiados = [...dadosApontamentoState];

    dadosCopiados.sort((a, b) => {
      if (criterio === "id_asc") return a.id - b.id;
      if (criterio === "id_desc") return b.id - a.id;

      if (criterio === "opAfetada_asc") return Number(a.op) - Number(b.op);
      if (criterio === "opAfetada_desc") return Number(b.op) - Number(a.op);

      if (criterio === "produzido_asc") return a.produzido - b.produzido;
      if (criterio === "produzido_desc") return b.produzido - a.produzido;

      if (criterio === "refugo_asc") return a.refugo - b.refugo;
      if (criterio === "refugo_desc") return b.refugo - a.refugo;

      return 0;
    });

    setDadosApontamentoState(dadosCopiados);
  };

  //filtros para apontamentos
  const apontamentoFilter = [
    { id: "data", label: "Data", type: "date-range" },
    { id: "produzido", label: "Produzido", type: "number-range" },
    { id: "refugo", label: "Refugo", type: "number-range" },
  ];

  const aplicarFiltrosApontamento = (filtrosSelecionados) => {
    let dadosFiltrados = [...todosApontamentos];

    //filtro por produzido
    if (filtrosSelecionados.produzido) {
      if (filtrosSelecionados.produzido.min != null) {
        dadosFiltrados = dadosFiltrados.filter(
          (a) => Number(a.produzido) >= filtrosSelecionados.produzido.min,
        );
      }

      if (filtrosSelecionados.produzido.max != null) {
        dadosFiltrados = dadosFiltrados.filter(
          (a) => Number(a.produzido) <= filtrosSelecionados.produzido.max,
        );
      }
    }

    //filtro por refugo
    if (filtrosSelecionados.refugo) {
      if (filtrosSelecionados.refugo.min != null) {
        dadosFiltrados = dadosFiltrados.filter(
          (a) => Number(a.refugo) >= filtrosSelecionados.refugo.min,
        );
      }

      if (filtrosSelecionados.refugo.max != null) {
        dadosFiltrados = dadosFiltrados.filter(
          (a) => Number(a.refugo) <= filtrosSelecionados.refugo.max,
        );
      }
    }

    //filtro por data
    if (filtrosSelecionados.data) {
      if (filtrosSelecionados.data.start) {
        dadosFiltrados = dadosFiltrados.filter(
          (a) => parseData(a.data) >= new Date(filtrosSelecionados.data.start),
        );
      }

      if (filtrosSelecionados.data.end) {
        dadosFiltrados = dadosFiltrados.filter(
          (a) => parseData(a.data) <= new Date(filtrosSelecionados.data.end),
        );
      }
    }

    setDadosApontamentoState(dadosFiltrados);
  };

  //filtra os dados atuais de APONTAMENTOS (filtrados e ordenados) pelo termo de busca
  const dadosApontamentosFiltrados = dadosApontamentoState.filter((a) => {
    const termo = buscaApontamento.toLowerCase();

    return (
      String(a.op || "")
        .toLowerCase()
        .includes(termo) || a.id?.toString().includes(termo)
    );
  });

  if (loadingMaquina) {
    return <LoadingState message="Sincronizando detalhes da máquina..." />;
  }

  return (
    <PageLayout>
      <DetailPageContainer>
        {/* Informações da Máquina */}

        {/* Voltar */}
        <DetailBackLink href="/gestor/maquinas" label="Voltar para Máquinas" />

        <MachineProfileCard
          machineName={maquina?.nome || `Máquina ${maquinaId}`}
          imageSrc={imagemMaquina}
          fieldsLeft={[
            { label: "ID", value: maquina?.id_maquina || maquinaId },
            { label: "Série", value: maquina?.serie || "-" },
            { label: "Setor", value: maquina?.id_setor || "-" },
            {
              label: "Status",
              value: (
                <StatusBadge
                  status={maquina?.status_atual || maquina?.status || "Parada"}
                />
              ),
            },
          ]}
          fieldsRight={[
            { label: "Operador", value: maquina?.id_operador || "-" },
            {
              label: "Data de Aquisição",
              value: formatarData(maquina?.data_aquisicao),
            },
            { label: "Velocidade Média", value: maquina?.capacidade || "-" },
          ]}
          actions={
            <DetailActions>
              <SyncPlacaDialog maquinaId={maquinaId} iconSize={36} />
              <Dialog>
                <DialogTrigger className="text-[var(--pencil)] cursor-pointer">
                  <Pencil size={36} className="mr-1" />
                </DialogTrigger>
                <DialogContent>
                  <FormEdicaoMaquina maquinaId={maquinaId} />
                </DialogContent>
              </Dialog>

              <Dialog>
                <DialogTrigger className="text-[var(--trash)] cursor-pointer">
                  <Trash2 className=" w-9 h-9" />
                </DialogTrigger>
                <DialogContent>
                  <FormExclusaoMaquina
                    maquinaId={maquinaId}
                    onExcluir={maquinaCrudService.delete}
                  />
                </DialogContent>
              </Dialog>
            </DetailActions>
          }
        />

        {/* Gráficos */}
        <DetailSectionTitle title="Produção" />

        <DetailWidgetGrid cols={2}>
          <DetailWidgetCard>
            <MotivoRefugoMaquinaWidget maquinaId={maquinaId} />
          </DetailWidgetCard>
          <DetailWidgetCard>
            <MotivoSetupMaquinaWidget maquinaId={maquinaId} />
          </DetailWidgetCard>
        </DetailWidgetGrid>

        <SectionHighlight>
          <OEEMaquinaWidget maquinaId={maquinaId} />
        </SectionHighlight>

        <DetailWidgetGrid cols={2}>
          <DetailWidgetCard>
            <OEEEvolucaoMaquinaWidget maquinaId={maquinaId} />
          </DetailWidgetCard>
          <DetailWidgetCard>
            <VelocidadeMaquinaWidget maquinaId={maquinaId} />
          </DetailWidgetCard>
        </DetailWidgetGrid>

        {/* Listagem histórico de eventos da máquina */}

        <ListingTabs
          className="mt-8"
          activeTab={activeListTab}
          onChange={setActiveListTab}
          tabs={[
            { id: "eventos", label: "Histórico de Eventos" },
            { id: "apontamentos", label: "Histórico de Apontamentos" },
          ]}
        />

        {activeListTab === "eventos" ? (
          <DetailListingSection
            id="listagem_eventos"
            title="Histórico de Eventos da Máquina"
            action={
              <Dialog>
                <DialogTrigger className="cursor-pointer bg-blue-900 flex items-center px-4 py-2 rounded-md text-white font-semibold text-lg gap-2">
                  <Plus size={28} />
                  Registrar
                </DialogTrigger>
                <DialogContent>
                  <FormCadastroEvento />
                </DialogContent>
              </Dialog>
            }
            search={
              <SearchBar
                value={buscaEvento}
                onChange={(e) => setBuscaEvento(e.target.value)}
                placeholder="Busque por nome ou id..."
              />
            }
            filterRow={
              <FilterRow
                count={dadosExibidos.length}
                label="eventos"
                actions={
                  <>
                    <OrdenarDropdown
                      label="Ordenar por"
                      options={opcoesOrdenacaoEventos}
                      onSortChange={handleSortEventos}
                    />
                    <FilterDropdown
                      filtersConfig={eventosFilter}
                      onApply={aplicarFiltrosEventos}
                    />
                  </>
                }
              />
            }
          >
            {/* Tabela */}
            {dadosExibidos.length > 0 ? (
              <TableListagens
                /* Dados e colunas a depender da página [no momento está estático definido em um json, posteriormente será um get]  */
                data={dadosExibidos}
                columns={colunasMaquina}
                acoesDropdown={(maquina) => (
                  <>
                    <Dialog>
                      <DialogTrigger asChild>
                        <DropdownMenuItem
                          onSelect={(e) => e.preventDefault()}
                          className="cursor-pointer"
                        >
                          <EyeIcon
                            strokeWidth={2}
                            className="mr-1 h-4 w-4 text-primary"
                          />
                          Ver Detalhes
                        </DropdownMenuItem>
                      </DialogTrigger>
                      <DialogContent>
                        <DetalhesEvento eventoId={maquina.id} />
                      </DialogContent>
                    </Dialog>

                    <SolicitarJustificativaMenuItem idEvento={maquina.id}>
                      <DropdownMenuItem
                        onSelect={(e) => e.preventDefault()}
                        className="cursor-pointer"
                      >
                        <BellRing className="mr-2 h-4 w-4" />
                        Solicitar Justificativa
                      </DropdownMenuItem>
                    </SolicitarJustificativaMenuItem>

                    <Dialog>
                      <DialogTrigger asChild>
                        <DropdownMenuItem
                          onSelect={(e) => e.preventDefault()}
                          className="cursor-pointer"
                        >
                          <Pencil className="mr-2 h-4 w-4 text-primary" />
                          Editar Evento
                        </DropdownMenuItem>
                      </DialogTrigger>
                      <DialogContent>
                        <FormEdicaoEvento />
                      </DialogContent>
                    </Dialog>
                  </>
                )}
              />
            ) : (
              //caso não encontre nada correspondente
              <EmptyState
                title="Nenhum evento encontrado"
                message={`Sem eventos para "${buscaEvento}".`}
              />
            )}
          </DetailListingSection>
        ) : (
          /* Listagem de Apontamentos */
          <DetailListingSection
            id="listagem_apontamentos"
            title="Histórico de Apontamentos da Máquina"
            search={
              <SearchBar
                value={buscaApontamento}
                onChange={(e) => setBuscaApontamento(e.target.value)}
                placeholder="Busque por nome ou id..."
              />
            }
            filterRow={
              <FilterRow
                count={dadosApontamentosFiltrados.length}
                label="apontamentos"
                actions={
                  <>
                    <OrdenarDropdown
                      label="Ordenar por"
                      options={opcoesOrdenacaoApontamento}
                      onSortChange={handleSortApontamento}
                    />
                    <FilterDropdown
                      filtersConfig={apontamentoFilter}
                      onApply={aplicarFiltrosApontamento}
                    />
                  </>
                }
              />
            }
          >
            {dadosApontamentosFiltrados.length > 0 ? (
              <TableListagens
                data={dadosApontamentosFiltrados}
                columns={colunasApontamento}
                acoesDropdown={(apontamento) => (
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link href={`/gestor/ordensDeProducao/${apontamento.id_ordem || apontamento.op}`}>
                      <EyeIcon className="mr-2 h-4 w-4" />
                      Ver OP relacionada
                    </Link>
                  </DropdownMenuItem>
                )}
              />
            ) : (
              <EmptyState
                title="Nenhum apontamento encontrado"
                message={`Sem apontamentos para "${buscaApontamento}".`}
              />
            )}
          </DetailListingSection>
        )}
      </DetailPageContainer>
    </PageLayout>
  );
}
