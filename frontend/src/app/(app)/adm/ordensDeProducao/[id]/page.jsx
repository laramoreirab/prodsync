"use client";

import Link from "next/link";
import Image from "next/image";
import { use, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

import TableListagens from "@/components/table";
import { DuracaoEvento } from "@/components/ui/duracaoEvento";
import { DataEvento } from "@/components/ui/dataEvento";
import { Badge } from "@/components/ui/badge";
import {
  BellRing,
  Pencil,
  ChevronDown,
  Trash2,
  Flame,
  Plus,
  EyeIcon,
  Loader2,
  MoveHorizontal,
  AlertTriangle,
  ArrowDown,
} from "lucide-react";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

import { OPProgressoWidget } from "@/features/ordens/OPProgressoWidget";
import { OPOEEDetalheWidget } from "@/features/ordens/OPOEEDetalheWidget";

import FormExclusaoOp from "@/components/ui/forms/ops/formExclusaoOp";
import FormEdicaoOp from "@/components/ui/forms/ops/formEdicaoOp";
import FormCadastroEvento from "@/components/ui/forms/historicoEventos/formCadastroEvento";
import DetalhesEvento from "@/components/ui/forms/historicoEventos/modalDetalhesEvento";
import OrdenarDropdown from "@/components/ui/OrdenarDropdown";
import FilterDropdown from "@/components/ui/FilterDropdown";
import FormEdicaoEvento from "@/components/ui/forms/historicoEventos/formEdicaoEvento";
import { SolicitarJustificativaMenuItem } from "@/components/ui/forms/historicoEventos/solicitarJustificativaDialog";
import { opCrudService } from "@/services/opCrudService";

// AnimatedComponents (FadeUpItem duplicado foi removido daqui e deixado só na desestruturação)
import {
  SearchBar,
  FilterRow,
  EmptyState,
  FadeUpItem,
  LoadingState, PageLayout,
  AsymmetricGrid

} from "@/components/AnimatedComponents";

// DetailComponents
import {
  DetailListingSection,
  DetailHeader,
  DetailActions,
  ListingTabs,
  DetailPageContainer,
  DetailBackLink,
  EntityProfileCard,
  DetailInfoField,
  DetailSectionTitle,
  DetailWidgetGrid,
  DetailWidgetCard,
  StatusBadge
} from "@/components/DetailComponents";
import { filtrarPorDuracaoMax } from "@/lib/filterUtils";

const colunasEventos = [
  { id: "id_exibicao_op", key: "id_exibicao_op", label: "ID", className: "w-20 text-center justify-center" },
  {
    id: "status",
    key: "evento",
    label: "Tipo",
    className: "text-center justify-center",
    icone: (valor) => {
      const config = {
        "Setup": { variant: "setup" },
        "Parada": { variant: "parada" }
      };
      const item = config[valor] || { icon: null };
      return (
        <Badge variant={item.variant} className={`whitespace-nowrap ${item.className} text-sm font-medium p-2.5`}>
          {item.icon}
          {valor}
        </Badge>
      );
    }
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
  { id: "observacao", key: "observacao", label: "Observação", className: "truncate max-w-[200px]" },
];

const colunasApontamento = [
  { id: "id", key: "id", label: "ID", className: "w-20 text-center justify-center" },
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
    icone: (valor) => (
      <Badge variant="outline" className="bg-green-500/15 text-green-600 text-sm font-semibold border-none">
        {valor}
      </Badge>
    ),
  },
  {
    id: "refugo",
    key: "refugo",
    label: "Refugo",
    className: "text-center justify-center",
    icone: (valor) => (
      <Badge variant="destructive" className="font-semibold text-sm border-none">
        {valor}
      </Badge>
    ),
  },
  { id: "observacao", key: "observacao", label: "Observação", className: "truncate max-w-[200px]" },
];

const formatarPeriodo = (inicio, fim) => {
  if (!inicio) return "-";
  const ini = new Date(inicio);
  const textoIni = `${ini.toLocaleDateString("pt-BR")} (${ini.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })})`;
  if (!fim) return `${textoIni})`;
  const end = new Date(fim);
  return `${textoIni} - ${end.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })})`;
};

const formatarDuracao = (minutos) => {
  const totalSegundos = Math.max(0, Math.round((Number(minutos) || 0) * 60));
  const horas = Math.floor(totalSegundos / 3600);
  const mins = Math.floor((totalSegundos % 3600) / 60);
  const segs = totalSegundos % 60;
  return `${String(horas).padStart(2, "0")}:${String(mins).padStart(2, "0")}:${String(segs).padStart(2, "0")}`;
};

const formatarDataHora = (valor) => {
  if (!valor) return "Não Informado";
  return new Date(valor).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const prioridadeBadge = (prioridade) => {
  const valor = prioridade || "";
  const config = {
    Média: { className: "border border-[var(--azul-cobalto)]", icon: <MoveHorizontal className="text-sky-600" /> },
    Alta: { className: "border border-[var(--amarelo)] bg-transparent", icon: <AlertTriangle className="text-amber-600" /> },
    Crítica: { className: "border border-[var(--vermelho-vivido)] bg-transparent text-black", icon: <Flame className="text-rose-600" /> },
    Baixa: { className: "border border-gray-400 text-sm bg-transparent text-black", icon: <ArrowDown className="text-slate-400" /> },
  };
  const item = config[valor] || { icon: null, className: "" };
  const label = valor === "Critica" ? "Crítica" : valor === "Media" ? "Média" : valor;
  return (
    <Badge variant="outline" className={`whitespace-nowrap ${item.className} text-sm font-medium p-2.5 ml-2`}>
      {item.icon}
      {label || "-"}
    </Badge>
  );
};

const statusBadge = (status) => {
  const config = {
    Produzindo: "bg-emerald-500/15 text-emerald-700",
    Parada: "bg-rose-500/15 text-rose-700",
    Setup: "bg-amber-500/15 text-amber-900",
    Concluída: "bg-sky-500/15 text-sky-700",
    Finalizada: "bg-sky-500/15 text-sky-700",
  };
  const label =
    status === "Em_Andamento" || status === "Aguardando" ? "Produzindo" : status === "Finalizada" ? "Concluída" : status || "-";
  return (
    <Badge variant="outline" className={`text-sm font-semibold border-none ml-2 ${config[label] || ""}`}>
      {label}
    </Badge>
  );
};

export default function OPDetalhePage({ params }) {
  const { id } = use(params);
  const router = useRouter();
  const opId = Number(id);


  // Estado para controlar a Tab Ativa das Listagens
  const [activeListTab, setActiveListTab] = useState("eventos");

  const [op, setOp] = useState(null);
  const [carregando, setSincronizando] = useState(true);

  const [dadosEventos, setDadosEventos] = useState([]);
  const [todosEventos, setTodosEventos] = useState([]);
  const [buscaEvento, setBuscaEvento] = useState("");

  const [dadosApontamentoState, setDadosApontamentoState] = useState([]);
  const [todosApontamentos, setTodosApontamentos] = useState([]);
  const [buscaApontamento, setBuscaApontamento] = useState("");

  const carregarDados = useCallback(async () => {
    if (!opId || Number.isNaN(opId)) return;
    setSincronizando(true);
    try {
      const [opDados, eventosRaw, apontamentosRaw] = await Promise.all([
        opCrudService.getById(opId),
        opCrudService.getHistoricoEventos(opId),
        opCrudService.getApontamentos(opId),
      ]);

      setOp(opDados);

      const eventos = eventosRaw.map((item) => ({
        ...item,
        id_exibicao_op: item.id_exibicao_op ?? item.numero_evento_op ?? item.id,
        evento: item.evento || item.tipo,
        data: formatarPeriodo(item.inicio, item.fim),
        duracao: formatarDuracao(item.duracao_minutos),
      }));

      const apontamentos = apontamentosRaw.map((item) => ({
        ...item,
        data: formatarPeriodo(item.inicio, item.fim),
      }));

      setTodosEventos(eventos);
      setDadosEventos(eventos);
      setTodosApontamentos(apontamentos);
      setDadosApontamentoState(apontamentos);
    } catch (error) {
      console.error("Erro ao carregar OP:", error);
    } finally {
      setSincronizando(false);
    }
  }, [opId]);

  useEffect(() => {
    carregarDados();
  }, [carregarDados]);

  // Função handleEditBatch adicionada para corrigir o erro da prop onEditSelected
  const handleEditBatch = (rows) => {
    console.log("Linhas selecionadas para edição em lote:", rows);
    // Adicione a lógica de edição em lote aqui
  };

  const opcoesOrdenacaoEventos = [
    { label: "ID Crescente", value: "id_asc" },
    { label: "ID Decrescente", value: "id_desc" },
    { label: "Data Crescente", value: "data_asc" },
    { label: "Data Decrescente", value: "data_desc" },
    { label: "Duração Crescente", value: "duracao_asc" },
    { label: "Duração Decrescente", value: "duracao_desc" },
  ];

  const handleSortEventos = (criterio) => {
    const copia = [...dadosEventos];
    copia.sort((a, b) => {
      if (criterio === "id_asc") return Number(a.id_exibicao_op ?? a.id) - Number(b.id_exibicao_op ?? b.id);
      if (criterio === "id_desc") return Number(b.id_exibicao_op ?? b.id) - Number(a.id_exibicao_op ?? a.id);
      if (criterio === "data_asc") return new Date(a.inicio) - new Date(b.inicio);
      if (criterio === "data_desc") return new Date(b.inicio) - new Date(a.inicio);
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
    setDadosEventos(copia);
  };

  const eventosFilter = [
    {
      id: "evento",
      label: "Tipo",
      type: "checkbox",
      options: ["Parada", "Setup"],
    },
    { id: "data", label: "Data", type: "date-range" },
    { id: "duracao", label: "Duração máx.", type: "time-max" },
  ];

  const aplicarFiltrosEventos = (filtrosSelecionados) => {
    let dadosFiltrados = [...todosEventos];

    if (filtrosSelecionados.evento?.length) {
      dadosFiltrados = dadosFiltrados.filter((e) => filtrosSelecionados.evento.includes(e.evento));
    }

    if (filtrosSelecionados.data?.start) {
      dadosFiltrados = dadosFiltrados.filter(
        (e) => new Date(e.inicio) >= new Date(filtrosSelecionados.data.start)
      );
    }
    if (filtrosSelecionados.data?.end) {
      dadosFiltrados = dadosFiltrados.filter(
        (e) => new Date(e.inicio) <= new Date(filtrosSelecionados.data.end)
      );
    }

    if (filtrosSelecionados.duracao?.max) {
      dadosFiltrados = filtrarPorDuracaoMax(dadosFiltrados, filtrosSelecionados.duracao.max);
    }

    setDadosEventos(dadosFiltrados);
  };

  const dadosExibidos = dadosEventos.filter((evento) => {
    const termo = buscaEvento.toLowerCase();
    return (
      evento.evento?.toLowerCase().includes(termo) ||
      evento.motivo?.toLowerCase().includes(termo) ||
      String(evento.id_exibicao_op ?? evento.id).includes(termo)
    );
  });

  // Duplicações removidas deste array
  const opcoesOrdenacaoApontamento = [
    { label: "ID Crescente", value: "id_asc" },
    { label: "ID Decrescente", value: "id_desc" },
    { label: "Produzido Crescente", value: "produzido_asc" },
    { label: "Produzido Decrescente", value: "produzido_desc" },
    { label: "Refugo Crescente", value: "refugo_asc" },
    { label: "Refugo Decrescente", value: "refugo_desc" },
  ];

  const handleSortApontamento = (criterio) => {
    const dadosCopiados = [...dadosApontamentoState];
    dadosCopiados.sort((a, b) => {
      if (criterio === "id_asc") return a.id - b.id;
      if (criterio === "id_desc") return b.id - a.id;
      if (criterio === "produzido_asc") return Number(a.produzido) - Number(b.produzido);
      if (criterio === "produzido_desc") return Number(b.produzido) - Number(a.produzido);
      if (criterio === "refugo_asc") return Number(a.refugo) - Number(b.refugo);
      if (criterio === "refugo_desc") return Number(b.refugo) - Number(a.refugo);
      return 0;
    });
    setDadosApontamentoState(dadosCopiados);
  };

  // Duplicações removidas deste array
  const apontamentoFilter = [
    { id: "data", label: "Data", type: "date-range" },
    { id: "produzido", label: "Produzido", type: "number-range" },
    { id: "refugo", label: "Refugo", type: "number-range" },
  ];

  const aplicarFiltrosApontamento = (filtrosSelecionados) => {
    let dadosFiltrados = [...todosApontamentos];

    if (filtrosSelecionados.produzido?.min != null) {
      dadosFiltrados = dadosFiltrados.filter((a) => Number(a.produzido) >= filtrosSelecionados.produzido.min);
    }
    if (filtrosSelecionados.produzido?.max != null) {
      dadosFiltrados = dadosFiltrados.filter((a) => Number(a.produzido) <= filtrosSelecionados.produzido.max);
    }
    if (filtrosSelecionados.refugo?.min != null) {
      dadosFiltrados = dadosFiltrados.filter((a) => Number(a.refugo) >= filtrosSelecionados.refugo.min);
    }
    if (filtrosSelecionados.refugo?.max != null) {
      dadosFiltrados = dadosFiltrados.filter((a) => Number(a.refugo) <= filtrosSelecionados.refugo.max);
    }
    if (filtrosSelecionados.data?.start) {
      dadosFiltrados = dadosFiltrados.filter(
        (a) => new Date(a.inicio) >= new Date(filtrosSelecionados.data.start)
      );
    }
    if (filtrosSelecionados.data?.end) {
      dadosFiltrados = dadosFiltrados.filter(
        (a) => new Date(a.inicio) <= new Date(filtrosSelecionados.data.end)
      );
    }

    setDadosApontamentoState(dadosFiltrados);
  };

  const dadosApontamentosFiltrados = dadosApontamentoState.filter((a) => {
    const termo = buscaApontamento.toLowerCase();
    return String(a.id).includes(termo) || (a.observacao?.toLowerCase() || "").includes(termo);
  });

  const maquina = op?.maquina;
  const setor = maquina?.setor;
  const operador = maquina?.operador;
  const tituloOp = op?.codigo_lote || op?.produto || `OP #${opId}`;

  const imagemMaquina = (() => {
    const apiUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001").replace(/\/$/, "");
    const imgPath = maquina?.imagem;
    if (!imgPath) return "/demo_maq.png";
    const imagem = String(imgPath).replaceAll("\\", "/");
    if (imagem.startsWith("http")) return imagem;
    if (imagem.startsWith("/uploads/")) return `${apiUrl}${imagem}`;
    const nomeArquivo = imagem.split("/").pop();
    return `${apiUrl}/uploads/imagens/${nomeArquivo}`;
  })();

  if (carregando) {
    return (
      <main className="min-h-screen bg-[url('/bg_app.svg')] bg-cover bg-fixed bg-center bg-no-repeat flex flex-col items-center justify-center p-20">
        <Loader2 className="w-10 h-10 animate-spin text-blue-900 mb-4" />
        <p className="text-lg text-gray-600 font-medium">Sincronizando ordem de produção...</p>
      </main>
    );
  }

  if (!op) {
    return (
      <main className="min-h-screen bg-[url('/bg_app.svg')] bg-cover bg-fixed bg-center bg-no-repeat flex flex-col p-8">
        <Link className="flex items-center mb-6" href="/adm/ordensDeProducao">
          <ChevronDown className="mr-1 text-gray-500 inline-block transform -rotate-270" />
          <p className="text-xl font-semibold text-gray-800">Voltar para Ordens de Produção</p>
        </Link>
        <p className="text-xl text-gray-700">Ordem de produção não encontrada.</p>
      </main>
    );
  }



  return (
    <PageLayout>
      <DetailPageContainer>

        <DetailBackLink href="/adm/ordensDeProducao" label="Voltar para Ordens de Produção" />

        <EntityProfileCard
          name={`Ordem de Produção  #${tituloOp}`}
          imageSrc={imagemMaquina}
          imageAlt={maquina?.nome || "Máquina"}
          imageShape="square"
          imageFallback="/demo_maq.png"
          fieldsLeft={[
            { label: "ID", value: opId },
            { label: "Produto", value: op.produto || "Não Informado" },
            { label: "Lote", value: op.codigo_lote || "Não Informado" },
            {
              label: "Setor",
              value: setor?.id_setor ? (
                <Link href={`/adm/setores/${setor.id_setor}`} className="hover:underline font-semibold text-blue-900">
                  {setor.nome_setor}
                </Link>
              ) : "Não Informado"
            },
            {
              label: "Máquina",
              value: maquina?.id_maquina ? (
                <Link href={`/adm/maquinas/${maquina.id_maquina}`} className="hover:underline font-semibold text-blue-900">
                  {maquina.nome || maquina.serie || "-"}
                </Link>
              ) : "Não Informado"
            },
            {
              label: "Operador",
              value: operador?.id_usuario ? (
                <Link href={`/adm/usuarios/${operador.id_usuario}`} className="hover:underline font-semibold text-blue-900">
                  {operador.nome}
                </Link>
              ) : "Não Informado"
            },
          ]}
          fieldsRight={[
            { label: "Status", value: statusBadge(op.status_op) },
            { label: "Prioridade", value: prioridadeBadge(op.prioridade) },
            { label: "Início", value: formatarDataHora(op.data_inicio) },
            { label: "Prazo Final", value: formatarDataHora(op.data_fim) },
            { label: "Meta Planejada", value: `${op.qtd_planejada ?? 0} peças` },
            { label: "Produção Atual", value: `${op.produzido ?? 0} peças produzidas / ${op.refugo_total ?? 0} peças em refugo` },
          ]}

          actions={
            <DetailActions>
              <Dialog>
                <DialogTrigger className="text-[#122f60] cursor-pointer">
                  <Pencil size={32} />
                </DialogTrigger>
                <DialogContent>
                  <FormEdicaoOp opId={opId} onEdicaoSucesso={carregarDados} />
                </DialogContent>
              </Dialog>
              <Dialog>
                <DialogTrigger className="text-[#b30000] cursor-pointer">
                  <Trash2 size={32} />
                </DialogTrigger>
                <DialogContent>
                  <FormExclusaoOp
                    opId={opId}
                    onExclusaoSucesso={() => router.push("/adm/ordensDeProducao")}
                  />
                </DialogContent>
              </Dialog>
            </DetailActions>
          }
        />

        <DetailSectionTitle title="Produção da OP" />

        <AsymmetricGrid side="right">
          <DetailWidgetCard>
            <OPProgressoWidget opId={opId} />
          </DetailWidgetCard>
          <DetailWidgetCard>
            <OPOEEDetalheWidget opId={opId} maquinaId={op?.id_maquina ?? maquina?.id_maquina} />
          </DetailWidgetCard>
        </AsymmetricGrid>

        {/* Listagens */}
        <ListingTabs
          className="mt-4"
          activeTab={activeListTab}
          onChange={setActiveListTab}
          tabs={[
            { id: "eventos", label: "Histórico de Eventos" },
            { id: "apontamentos", label: "Histórico de Apontamentos" },
          ]}
        />

        {/* Renderização Condicional baseada na Tab Ativa */}
        {activeListTab === "eventos" ? (
          <DetailListingSection
            id="listagem_histEventos"
            title="Histórico de Eventos da OP"
            action={
              <Dialog>
                <DialogTrigger className="cursor-pointer bg-blue-900 flex items-center px-3 py-1.5 rounded-md text-white font-semibold text-2xl gap-2">
                  <Plus size={28} className="text-white cursor-pointer" />
                  Cadastrar
                </DialogTrigger>
                <DialogContent>
                  <FormCadastroEvento onCadastroSucesso={carregarDados} />
                </DialogContent>
              </Dialog>
            }
            search={
              <SearchBar
                value={buscaEvento}
                onChange={(e) => setBuscaEvento(e.target.value)}
                placeholder="Busque por id, tipo ou motivo..."
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
            <FadeUpItem>
              {dadosExibidos.length > 0 ? (
                <TableListagens
                  data={dadosExibidos}
                  columns={colunasEventos}
                  enableSelection={true}
                  onEditSelected={(rows) => handleEditBatch(rows)}
                  acoesDropdown={(evento) => (
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
                          <DetalhesEvento eventoId={evento.id} />
                        </DialogContent>
                      </Dialog>

                      <SolicitarJustificativaMenuItem idEvento={evento.id}>
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
                          <FormEdicaoEvento eventoId={evento.id} onEdicaoSucesso={carregarDados} />
                        </DialogContent>
                      </Dialog>
                    </>
                  )}
                />
              ) : (
                <EmptyState
                  title="Nenhum evento encontrado"
                  message="Ajuste os filtros ou o termo de busca."
                />
              )}
            </FadeUpItem>
          </DetailListingSection>
        ) : (
          <FadeUpItem>
            <DetailListingSection
              id="listagem_histApontamentos"
              title="Histórico de Apontamentos da OP"
              search={
                <SearchBar
                  value={buscaApontamento}
                  onChange={(e) => setBuscaApontamento(e.target.value)}
                  placeholder="Busque por id ou observação..."
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
                />
              ) : (
                <EmptyState
                  title="Nenhum apontamento encontrado"
                  message="Ajuste os filtros ou o termo de busca."
                />
              )}
            </DetailListingSection>
          </FadeUpItem>
        )}

      </DetailPageContainer>
    </PageLayout>
  );
}
