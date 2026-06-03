"use client";
import { use, useState, useEffect, useCallback } from "react";

import TableListagens from "@/components/table";
import { DuracaoEvento } from "@/components/ui/duracaoEvento";
import { DataEvento } from "@/components/ui/dataEvento";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, Pencil, Plus, Flame, Search, EyeIcon, Loader2 } from "lucide-react";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { OPProgressoWidget } from "@/features/ordens/OPProgressoWidget";
import { OPOEEDetalheWidget } from "@/features/ordens/OPOEEDetalheWidget";
import DetalhesEvento from "@/components/ui/forms/historicoEventos/modalDetalhesEvento";
import FormCriarApontamento from "@/components/ui/forms/maquinas/criarApontamento";
import FormJustificativaEvento from "@/components/ui/forms/historicoEventos/formJustificativaEvento";
import Link from "next/link";
import Image from "next/image";
import OrdenarDropdown from "@/components/ui/OrdenarDropdown";
import FilterDropdown from "@/components/ui/FilterDropdown";
import { opCrudService } from "@/services/opCrudService";
import {
  filtrarPorDataInicio,
  filtrarPorDuracaoMax,
  filtrarPorNumberRange,
  duracaoEmMinutos,
} from "@/lib/filterUtils";

const prioridadeIcone = {
  "Crítica": { icon: Flame, className: "border border-rose-500/30 bg-rose-500/10 text-rose-700" },
  "Alta": { className: "border border-amber-500/30 bg-amber-500/10 text-amber-700" },
  "Média": { className: "border border-sky-500/30 bg-sky-500/10 text-sky-700" },
  "Baixa": { className: "border border-slate-400/30 bg-slate-100 text-slate-700" },
};

function formatarDataHora(valor) {
  if (!valor) return "-";
  return new Date(valor).toLocaleString("pt-BR", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

import { motion } from "framer-motion";


import {
  PageLayout,
  PageSection,
  SearchBar,
  FilterRow,
  EmptyState,
  LoadingState,
} from "@/components/AnimatedComponents";
import {
  DetailPageContainer,
  DetailBackLink,
  DetailHeader,
  DetailActions,
  DetailWidgetGrid,
  DetailWidgetCard,
  DetailListingSection,
  SectionHighlight,
} from "@/components/DetailComponents";

export default function OPDetalhePage({ params }) {
  const { id } = use(params);
  const opId = id;

  const [op, setOp] = useState(null);
  const [eventos, setEventos] = useState([]);
  const [apontamentos, setApontamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const carregarDados = useCallback(async () => {
    if (!opId) return;
    setLoading(true);
    try {
      const [opData, eventosData, apontamentosData] = await Promise.all([
        opCrudService.getById(opId),
        opCrudService.getHistoricoEventos(opId),
        opCrudService.getApontamentos(opId),
      ]);
      setOp(opData);
      setEventos(eventosData || []);
      setApontamentos((apontamentosData || []).map((a) => ({
        ...a,
        data: a.data || (a.inicio && a.fim
          ? `${formatarDataHora(a.inicio)} - ${formatarDataHora(a.fim)}`
          : formatarDataHora(a.inicio)),
      })));
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Falha ao carregar ordem de produção");
    } finally {
      setLoading(false);
    }
  }, [opId]);

  useEffect(() => {
    carregarDados();
  }, [carregarDados]);

  const [buscaEvento, setBuscaEvento] = useState("");
  const [eventosOrdenados, setEventosOrdenados] = useState(null);
  const [eventosFiltrados, setEventosFiltrados] = useState(null);

  const dadosEventosBase = eventosFiltrados ?? eventos;
  const dadosEventosExibidos = (eventosOrdenados ?? dadosEventosBase).filter(
    (evento) => {
      const termo = buscaEvento.toLowerCase();
      return (
        evento.tipo?.toLowerCase().includes(termo) ||
        evento.id?.toString().includes(termo)
      );
    },
  );

  const colunasOP = [
    {
      id: "id",
      key: "id",
      label: "ID",
      className: "w-20 text-center justify-center",
    },
    {
      id: "tipo",
      key: "tipo",
      label: "Status",
      className: "text-center justify-center",
      icone: (valor) => {
        const config = {
          Setup: {
            variant: "secondary",
            className: "bg-[var(--amarelo-setup)] text-amarelo font-semibold text-sm",
          },
          Parada: {
            variant: "destructive",
            className: "font-semibold text-sm border-none",
          },
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
      icone: (valor, row) => (
        <DuracaoEvento inicio={row.inicio} fim={row.fim} />
      ),
    },
    { id: "motivo", key: "motivo", label: "Motivo" },
    { id: "observacao", key: "observacao", label: "Observação" },
  ];

  const opcoesOrdenacaoEventos = [
    { label: "ID Crescente", value: "id_asc" },
    { label: "ID Decrescente", value: "id_desc" },
    { label: "Data Crescente", value: "data_asc" },
    { label: "Data Decrescente", value: "data_desc" },
    { label: "Duração Crescente", value: "duracao_asc" },
    { label: "Duração Decrescente", value: "duracao_desc" },
  ];

  const handleSortEventos = (criterio) => {
    const copia = [...dadosEventosBase];
    copia.sort((a, b) => {
      if (criterio === "id_asc") return a.id - b.id;
      if (criterio === "id_desc") return b.id - a.id;
      if (criterio === "data_asc") return new Date(a.inicio) - new Date(b.inicio);
      if (criterio === "data_desc") return new Date(b.inicio) - new Date(a.inicio);
      if (criterio === "duracao_asc") return duracaoEmMinutos(a) - duracaoEmMinutos(b);
      if (criterio === "duracao_desc") return duracaoEmMinutos(b) - duracaoEmMinutos(a);
      return 0;
    });
    setEventosOrdenados(copia);
  };

  const eventosFilter = [
    {
      id: "tipo",
      label: "Tipo",
      type: "checkbox",
      options: ["Parada", "Setup"],
    },
    { id: "data", label: "Data", type: "date-range" },
    { id: "duracao", label: "Duração máx.", type: "time-max" },
  ];

  const aplicarFiltrosEventos = (filtrosSelecionados) => {
    let dadosFiltrados = [...eventos];

    if (filtrosSelecionados.tipo?.length) {
      dadosFiltrados = dadosFiltrados.filter((e) =>
        filtrosSelecionados.tipo.includes(e.tipo),
      );
    }

    dadosFiltrados = filtrarPorDataInicio(dadosFiltrados, filtrosSelecionados.data);
    if (filtrosSelecionados.duracao?.max) {
      dadosFiltrados = filtrarPorDuracaoMax(dadosFiltrados, filtrosSelecionados.duracao.max);
    }

    setEventosFiltrados(dadosFiltrados);
    setEventosOrdenados(null);
  };

  const [dadosApontamentoState, setDadosApontamentoState] = useState([]);
  const [buscaApontamento, setBuscaApontamento] = useState("");

  useEffect(() => {
    setDadosApontamentoState(apontamentos);
  }, [apontamentos]);

  const colunasApontamento = [
    {
      id: "id",
      key: "id",
      label: "ID",
      className: "w-20 text-center justify-center",
    },
    { id: "data", key: "data", label: "Data (Início - Fim)" },
    {
      id: "produzido",
      key: "produzido",
      label: "Produzido",
      className: "text-center justify-center",
      icone: (valor) => (
        <Badge
          variant="outline"
          className="bg-green-500/15 text-green-600 text-sm font-semibold border-none"
        >
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
        <Badge
          variant="destructive"
          className="font-semibold text-sm border-none"
        >
          {valor}
        </Badge>
      ),
    },
    { id: "observacao", key: "observacao", label: "Observação" },
  ];

  const opcoesOrdenacaoApontamento = [
    { label: "ID Crescente", value: "id_asc" },
    { label: "ID Decrescente", value: "id_desc" },
    { label: "Produzido Crescente", value: "produzido_asc" },
    { label: "Produzido Decrescente", value: "produzido_desc" },
    { label: "Refugo Crescente", value: "refugo_asc" },
    { label: "Refugo Decrescente", value: "refugo_desc" },
  ];

  const handleSortApontamento = (criterio) => {
    const copia = [...dadosApontamentoState];
    copia.sort((a, b) => {
      if (criterio === "id_asc") return a.id - b.id;
      if (criterio === "id_desc") return b.id - a.id;
      if (criterio === "produzido_asc")
        return Number(a.produzido) - Number(b.produzido);
      if (criterio === "produzido_desc")
        return Number(b.produzido) - Number(a.produzido);
      if (criterio === "refugo_asc") return Number(a.refugo) - Number(b.refugo);
      if (criterio === "refugo_desc")
        return Number(b.refugo) - Number(a.refugo);
      return 0;
    });
    setDadosApontamentoState(copia);
  };

  const apontamentoFilter = [
    { id: "produzido", label: "Produzido", type: "number-range" },
    { id: "refugo", label: "Refugo", type: "number-range" },
  ];

  const aplicarFiltrosApontamento = (filtrosSelecionados) => {
    let dadosFiltrados = [...apontamentos];
    dadosFiltrados = filtrarPorNumberRange(dadosFiltrados, "produzido", filtrosSelecionados.produzido);
    dadosFiltrados = filtrarPorNumberRange(dadosFiltrados, "refugo", filtrosSelecionados.refugo);
    setDadosApontamentoState(dadosFiltrados);
  };

  const dadosApontamentosFiltrados = dadosApontamentoState.filter((a) => {
    const termo = buscaApontamento.toLowerCase();
    return a.id?.toString().includes(termo);
  });

  if (loading) {
    return (
      <main className="min-h-screen bg-[url('/bg_app.svg')] bg-cover bg-fixed flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-blue-900" />
      </main>
    );
  }

  if (error || !op) {
    return (
      <main className="min-h-screen bg-[url('/bg_app.svg')] bg-cover bg-fixed flex flex-col items-center justify-center p-8">
        <p className="text-red-500 text-lg">{error || "Ordem não encontrada"}</p>
        <Link href="/operador/ordensDeProducao" className="mt-4 text-blue-900 underline">Voltar</Link>
      </main>
    );
  }

  const titulo = op.codigo_lote || op.nome || `#${op.id ?? opId}`;
  const maquinaNome = op.maquina?.nome || "-";
  const maquinaImagem = op.maquina?.imagem || "/demo_maq.png";
  const prioridade = op.prioridade || "-";
  const statusOp = op.status_op || "-";
  const prioConfig = prioridadeIcone[prioridade] || { className: "" };
  const PrioIcon = prioConfig.icon;

  const statusBadge = {
    Produzindo: "bg-emerald-500/15 text-emerald-700",
    Parada: "bg-rose-500/15 text-rose-700",
    Setup: "bg-amber-500/15 text-amber-900",
    "Concluída": "bg-sky-500/15 text-sky-700",
    "Aguardando Início": "bg-slate-500/15 text-slate-700",
  };

  return (
    <PageLayout padded={false}>
      <DetailPageContainer>
        <DetailBackLink
          href="/operador/ordensDeProducao"
          label="Voltar para Ordens de Produção"
        />

        <DetailHeader
          title={`Ordem de Produção ${titulo}`}
          actions={
            <DetailActions>
              <Dialog>
                <DialogTrigger className="bg-secondary-foreground px-4 py-1 rounded-md flex items-center text-white text-xl font-semibold cursor-pointer">
                  <Plus className="mr-2" />
                  Criar Apontamento
                </DialogTrigger>
                <DialogContent>
                  <FormCriarApontamento
                    id_ordemProducao={opId}
                    id_maquina={op.id_maquina ?? op.maquina?.id_maquina}
                    onSuccess={carregarDados}
                  />
                </DialogContent>
              </Dialog>

              <Dialog>
                <DialogTrigger className="bg-[var(--chart2)] px-7 py-1 rounded-md flex items-center text-white text-xl font-semibold cursor-pointer">
                  <Pencil className="mr-2" />
                  Justificar Evento
                </DialogTrigger>
                <DialogContent>
                  <FormJustificativaEvento />
                </DialogContent>
              </Dialog>
            </DetailActions>
          }
        />

        <section>
          <motion.div
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.05 } } }}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center"
          >
            <motion.div
              variants={{ hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } } }}
              className="md:col-span-2"
            >
              <div className="flex items-center">
                <div className="flex gap-2 bg-white border rounded-xl shadow-sm w-1/4.7 flex-col items-center justify-center text-center font-bold p-8 mr-4">
                  <Image src={maquinaImagem} className="rounded-lg object-cover" alt="Máquina" width={150} height={150} />
                  <p className="text-2xl">{maquinaNome}</p>
                  <p className="text-[#7c7c81] text-2xl font-semibold">Meta: {op.qtd_planejada ?? "-"} peças</p>
                </div>
                <div className="py-3 font-semibold text-gray-900 text-2xl">
                  <div className="flex flex-col gap-5">
                    <p>
                      Status:
                      <Badge variant="outline" className={`ml-2 border-none font-semibold ${statusBadge[statusOp] || ""}`}>
                        {statusOp}
                      </Badge>
                    </p>
                    <p>
                      Prioridade:
                      <Badge variant="outline" className={`ml-2 text-sm font-medium ${prioConfig.className}`}>
                        {PrioIcon && <PrioIcon className="text-vermelho-vivido inline mr-1" />}
                        {prioridade}
                      </Badge>
                    </p>
                    <div className="flex">
                      <p>Início:</p>
                      <p className="text-2xl font-medium ml-2">{formatarDataHora(op.data_inicio ?? op.data_hora_inicio)}</p>
                    </div>
                    <div className="flex">
                      <p>Prazo Final:</p>
                      <p className="text-2xl font-medium ml-2">{formatarDataHora(op.data_fim ?? op.data_hora_fim)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              variants={{ hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } } }}
              className="md:col-span-1 bg-white border rounded-xl p-6 shadow-sm"
            >
              <OPProgressoWidget opId={opId} />
            </motion.div>
          </motion.div>
        </section>

        <SectionHighlight>
          <OPOEEDetalheWidget opId={opId} maquinaId={op.id_maquina ?? op.maquina?.id_maquina} />
        </SectionHighlight>

        <DetailListingSection
          id="listagem_histEventos"
          title="Histórico de Eventos da OP"
          search={
            <SearchBar
              value={buscaEvento}
              onChange={(e) => setBuscaEvento(e.target.value)}
              placeholder="Busque por id ou tipo de evento..."
            />
          }
          filterRow={
            <FilterRow
              count={dadosEventosExibidos.length}
              label="eventos"
              actions={
                <>
                  <OrdenarDropdown label="Ordenar por" options={opcoesOrdenacaoEventos} onSortChange={handleSortEventos} />
                  <FilterDropdown filtersConfig={eventosFilter} onApply={aplicarFiltrosEventos} />
                </>
              }
            />
          }
        >
          {dadosEventosExibidos.length > 0 ? (
            <TableListagens
              data={dadosEventosExibidos}
              columns={colunasOP}
              acoesDropdown={(evento) => (
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
              )}
            />
          ) : (
            <EmptyState
              title="Nenhum evento encontrado"
              message="Não encontramos nenhum evento com esse termo ou filtro."
            />
          )}
        </DetailListingSection>

        <DetailListingSection
          id="listagem_histApontamentos"
          title="Histórico de Apontamentos da OP"
          search={
            <SearchBar
              value={buscaApontamento}
              onChange={(e) => setBuscaApontamento(e.target.value)}
              placeholder="Busque por id..."
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
              message="Não encontramos nenhum apontamento com esse termo ou filtro."
            />
          )}
        </DetailListingSection>
      </DetailPageContainer>
    </PageLayout>
  );
}
