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
  Search,
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
import ModalSucessNotificacao from "@/components/ui/forms/historicoEventos/modalSucessNotificacao";
import { opCrudService } from "@/services/opCrudService";
import { FadeUpItem } from "@/components/AnimatedComponents";

// AnimatedComponents
import {
  PageLayout,
  SearchBar,
  FilterRow,
  EmptyState,
  WidgetCard,
  FadeUpItem
} from "@/components/AnimatedComponents";

// DetailComponents
import {
  DetailPageContainer,
  DetailBackLink,
  DetailHeader,
  DetailActions,
  DetailInfoCard,
  DetailInfoColumn,
  DetailInfoField,
  DetailWidgetGrid,
  DetailWidgetCard,
  DetailListingSection,
  StatusBadge,
} from "@/components/DetailComponents";
import { filtrarPorDuracaoMax, filtrarPorNumberRange, duracaoEmMinutos } from "@/lib/filterUtils";

const colunasEventos = [
  { id: "id", key: "id", label: "ID", className: "w-20 text-center justify-center" },
  {
    id: "status",
    key: "evento",
    label: "Tipo",
    className: "text-center justify-center",
    icone: (valor) => {
      const config = {
        Setup: {
          variant: "outline",
          className:
            "!border-amber-300 !bg-amber-100 !text-amber-900 font-semibold text-sm dark:!border-amber-300/45 dark:!bg-amber-300/20 dark:!text-amber-100",
        },
        Parada: { variant: "destructive", className: "font-semibold text-sm border-none" },
      };
      const estilo = config[valor] || { variant: "outline", className: "" };
      return (
        <Badge variant={estilo.variant} className={`whitespace-nowrap ${estilo.className}`}>
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
  { id: "observacao", key: "observacao", label: "Observação" },
];

const formatarPeriodo = (inicio, fim) => {
  if (!inicio) return "-";
  const ini = new Date(inicio);
  const textoIni = `${ini.toLocaleDateString("pt-BR")} (${ini.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}`;
  if (!fim) return `${textoIni})`;
  const end = new Date(fim);
  return `${textoIni} - ${end.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })})`;
};

const formatarDuracao = (minutos) => {
  const total = Number(minutos) || 0;
  const horas = Math.floor(total / 60);
  const mins = Math.round(total % 60);
  return `${String(horas).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
};

const formatarDataHora = (valor) => {
  if (!valor) return "-";
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
    Média: { className: "border border-[var(--azul-cobalto)]", icon: <MoveHorizontal className="text-azul-cobalto" /> },
    Media: { className: "border border-[var(--azul-cobalto)]", icon: <MoveHorizontal className="text-azul-cobalto" /> },
    Alta: { className: "border border-[var(--amarelo)] bg-transparent", icon: <AlertTriangle className="text-amarelo" /> },
    Crítica: { className: "border border-[var(--vermelho-vivido)] bg-transparent text-black", icon: <Flame className="text-vermelho-vivido" /> },
    Critica: { className: "border border-[var(--vermelho-vivido)] bg-transparent text-black", icon: <Flame className="text-vermelho-vivido" /> },
    Baixa: { className: "border border-gray-400 text-sm bg-transparent text-black", icon: <ArrowDown className="text-gray-400" /> },
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
    Produzindo: "bg-green-500/15 text-green-600",
    Parada: "bg-red-500/15 text-red-600",
    Setup: "bg-amber-500/15 text-amber-800",
    Concluída: "bg-gray-500/15 text-gray-700",
    Finalizada: "bg-gray-500/15 text-gray-700",
  };
  const label =
    status === "Em_Andamento" ? "Produzindo" : status === "Finalizada" ? "Concluída" : status || "-";
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

  const [op, setOp] = useState(null);
  const [carregando, setCarregando] = useState(true);

  const [dadosEventos, setDadosEventos] = useState([]);
  const [todosEventos, setTodosEventos] = useState([]);
  const [buscaEvento, setBuscaEvento] = useState("");

  const [dadosApontamentoState, setDadosApontamentoState] = useState([]);
  const [todosApontamentos, setTodosApontamentos] = useState([]);
  const [buscaApontamento, setBuscaApontamento] = useState("");

  const carregarDados = useCallback(async () => {
    if (!opId || Number.isNaN(opId)) return;
    setCarregando(true);
    try {
      const [opDados, eventosRaw, apontamentosRaw] = await Promise.all([
        opCrudService.getById(opId),
        opCrudService.getHistoricoEventos(opId),
        opCrudService.getApontamentos(opId),
      ]);

      setOp(opDados);

      const eventos = eventosRaw.map((item) => ({
        ...item,
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
      setCarregando(false);
    }
  }, [opId]);

  useEffect(() => {
    carregarDados();
  }, [carregarDados]);

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
      if (criterio === "id_asc") return a.id - b.id;
      if (criterio === "id_desc") return b.id - a.id;
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
      dadosFiltrados = dadosFiltrados.filter((e) => filtrosSelecionados.evento.includes(e.evento),);
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
      String(evento.id).includes(termo)
    );
  });

  const opcoesOrdenacaoApontamento = [
    { label: "ID Crescente", value: "id_asc" },
    { label: "ID Decrescente", value: "id_desc" },
    { label: "Produzido Crescente", value: "produzido_asc" },
    { label: "Produzido Decrescente", value: "produzido_desc" },
    { label: "Refugo Crescente", value: "refugo_asc" },
    { label: "Refugo Decrescente", value: "refugo_desc" },
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

  const apontamentoFilter = [
    { id: "data", label: "Data", type: "date-range" },
    { id: "produzido", label: "Produzido", type: "number-range" },
    { id: "refugo", label: "Refugo", type: "number-range" },
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

  if (carregando) {
    return (
      <main className="min-h-screen bg-[url('/bg_app.svg')] bg-cover bg-fixed bg-center bg-no-repeat flex flex-col items-center justify-center p-20">
        <Loader2 className="w-10 h-10 animate-spin text-blue-900 mb-4" />
        <p className="text-lg text-gray-600 font-medium">Carregando ordem de produção...</p>
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
    <main className="min-h-screen bg-[url('/bg_app.svg')] bg-cover bg-fixed bg-center bg-no-repeat flex flex-col">
      <div className="w-full mt-8 pb-10 px-8 space-y-4">
        <Link className="flex items-center" href="/adm/ordensDeProducao">
          <ChevronDown className="mr-1 text-gray-500 inline-block transform -rotate-270" />
          <p className="text-xl font-semibold text-gray-800">Voltar para Ordens de Produção</p>
        </Link>

        <section id="infos_op" className="flex flex-col">
          <div className="flex justify-between items-center">
            <h1 className="text-4xl font-bold text-black">
              Ordem de Produção — {tituloOp}
            </h1>
            <div className="flex space-x-2">
              <Dialog>
                <DialogTrigger className="text-[#122f60] cursor-pointer">
                  <Pencil size={36} className="mr-1" />
                </DialogTrigger>
                <DialogContent>
                  <FormEdicaoOp opId={opId} onEdicaoSucesso={carregarDados} />
                </DialogContent>
              </Dialog>
              <Dialog>
                <DialogTrigger className="text-[#b30000] cursor-pointer">
                  <Trash2 className="w-9 h-9" />
                </DialogTrigger>
                <DialogContent>
                  <FormExclusaoOp
                    opId={opId}
                    onExclusaoSucesso={() => router.push("/adm/ordensDeProducao")}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </section>

        <section>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="md:col-span-2">
              <div className="flex items-center flex-wrap gap-4">
                <div className="flex gap-2 bg-white border rounded-xl shadow-sm flex-col items-center justify-center text-center font-bold p-8 min-w-[200px]">
                  {maquina?.id_maquina ? (
                    <Link href={`/adm/maquinas/${maquina.id_maquina}`}>
                      <Image
                        src="/demo_maq.png"
                        className="rounded-lg"
                        alt={maquina.nome || "Máquina"}
                        width={150}
                        height={150}
                      />
                      <p className="text-2xl mt-2 hover:underline">{maquina.nome || maquina.serie || "-"}</p>
                    </Link>
                  ) : (
                    <>
                      <Image src="/demo_maq.png" className="rounded-lg" alt="Máquina" width={150} height={150} />
                      <p className="text-2xl mt-2">-</p>
                    </>
                  )}
                  <p className="text-[#7c7c81] text-xl font-semibold mt-1">
                    Meta: {op.qtd_planejada ?? 0} peças
                  </p>
                  <p className="text-[#7c7c81] text-lg">
                    Produzido: {op.produzido ?? 0} · Refugo: {op.refugo_total ?? 0}
                  </p>
                </div>

                <div className="py-3 font-semibold text-gray-900 text-2xl">
                  <div className="flex flex-col gap-3">
                    <p className="text-lg text-gray-600">Produto: {op.produto || "-"}</p>
                    <p className="text-lg text-gray-600">Lote: {op.codigo_lote || "-"}</p>
                    <p>
                      Setor:
                      {setor?.id_setor ? (
                        <Link
                          href={`/adm/setores/${setor.id_setor}`}
                          className="font-medium hover:underline ml-2"
                        >
                          {setor.nome_setor}
                        </Link>
                      ) : (
                        <span className="ml-2 font-medium">-</span>
                      )}
                    </p>
                    <p>
                      Status:
                      {statusBadge(op.status_op)}
                    </p>
                    <p className="flex items-center flex-wrap">
                      Prioridade:
                      {prioridadeBadge(op.prioridade)}
                    </p>
                    <p>
                      Operador:
                      {operador?.id_usuario ? (
                        <Link
                          href={`/adm/usuarios/${operador.id_usuario}`}
                          className="font-medium hover:underline ml-2"
                        >
                          {operador.nome}
                        </Link>
                      ) : (
                        <span className="ml-2 font-medium">-</span>
                      )}
                    </p>
                    <p>
                      Início:
                      <span className="text-xl font-medium ml-2">{formatarDataHora(op.data_inicio)}</span>
                    </p>
                    <p>
                      Prazo final:
                      <span className="text-xl font-medium ml-2">{formatarDataHora(op.data_fim)}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="md:col-span-1 bg-white border rounded-xl p-6 shadow-sm">
              <OPProgressoWidget opId={opId} />
            </div>
          </div>
        </section>

        <section className="bg-white border rounded-xl p-6 shadow-sm">
          <OPOEEDetalheWidget opId={opId} />
        </section>

        {/* Listagens */}
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
          {/* Tabela */}
          <FadeUpItem>
            {dadosExibidos.length > 0 ? (
              <TableListagens
                data={dadosExibidos}
                columns={colunasEventos}
                enableSelection={true}
                onEditSelected={(rows) => handleEditBatch(rows)}
                acoesDropdown={(evento) => (
                  <>
                    {/* O comentário dentro do fragmento agora é válido */}
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

                    <Dialog>
                      <DialogTrigger asChild>
                        <DropdownMenuItem
                          onSelect={(e) => e.preventDefault()}
                          className="cursor-pointer"
                        >
                          <BellRing className="mr-2 h-4 w-4" />
                          Solicitar Justificativa
                        </DropdownMenuItem>
                      </DialogTrigger>
                      <DialogContent>
                        <ModalSucessNotificacao />
                      </DialogContent>
                    </Dialog>

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

        {/* Listagem de Hist. Apontamentos da OP  */}
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
            {/* Tabela */}
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
      </div>
    </main>
  );
}
