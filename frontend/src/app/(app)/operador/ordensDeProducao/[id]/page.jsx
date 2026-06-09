"use client";

import { use, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Pencil,
  Plus,
  Flame,
  EyeIcon,
  Loader2,
  MoveHorizontal,
  AlertTriangle,
  ArrowDown
} from "lucide-react";

import TableListagens from "@/components/table";
import { DuracaoEvento } from "@/components/ui/duracaoEvento";
import { DataEvento } from "@/components/ui/dataEvento";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { OPProgressoWidget } from "@/features/ordens/OPProgressoWidget";
import { OPOEEDetalheWidget } from "@/features/ordens/OPOEEDetalheWidget";
import DetalhesEvento from "@/components/ui/forms/historicoEventos/modalDetalhesEvento";
import FormCriarApontamento from "@/components/ui/forms/maquinas/criarApontamento";
import FormJustificativaEvento from "@/components/ui/forms/historicoEventos/formJustificativaEvento";
import OrdenarDropdown from "@/components/ui/OrdenarDropdown";
import FilterDropdown from "@/components/ui/FilterDropdown";
import { opCrudService } from "@/services/opCrudService";
import {
  filtrarPorDuracaoMax,
} from "@/lib/filterUtils";

import {
  SearchBar,
  FilterRow,
  EmptyState,
  FadeUpItem,
  LoadingState,
  PageLayout,
  AsymmetricGrid
} from "@/components/AnimatedComponents";

// DetailComponents
import {
  DetailListingSection,
  DetailActions,
  ListingTabs,
  DetailPageContainer,
  DetailBackLink,
  EntityProfileCard,
  DetailSectionTitle,
  DetailWidgetCard
} from "@/components/DetailComponents";

// ─── Helpers e Configurações ─────────────────────────────────────────────────

const formatarPeriodo = (inicio, fim) => {
  if (!inicio) return "-";
  const ini = new Date(inicio);
  const textoIni = `${ini.toLocaleDateString("pt-BR")} (${ini.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })})`;
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
    Alta: { className: "border border-amber-500/30 bg-amber-500/10 text-amber-700", icon: <AlertTriangle className="text-amber-600" /> },
    Crítica: { className: "border border-[var(--vermelho-vivido)] bg-transparent text-black", icon: <Flame className="text-rose-600" /> },
    Baixa: { className: "border border-slate-400/30 bg-slate-100 text-slate-700", icon: <ArrowDown className="text-slate-400" /> },
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
    "Aguardando Início": "bg-slate-500/15 text-slate-700",
  };
  const label =
    status === "Em_Andamento" ? "Produzindo" : status === "Finalizada" ? "Concluída" : status || "-";
  return (
    <Badge variant="outline" className={`text-sm font-semibold border-none ml-2 ${config[label] || ""}`}>
      {label}
    </Badge>
  );
};

// ─── Componente Principal ────────────────────────────────────────────────────

export default function OPDetalhePage({ params }) {
  const { id } = use(params);
  const router = useRouter();
  const opId = Number(id);

  const [activeListTab, setActiveListTab] = useState("eventos");
  const [op, setOp] = useState(null);
  const [loading, setLoading] = useState(true);

  const [todosEventos, setTodosEventos] = useState([]);
  const [dadosEventos, setDadosEventos] = useState([]);
  const [buscaEvento, setBuscaEvento] = useState("");

  const [todosApontamentos, setTodosApontamentos] = useState([]);
  const [dadosApontamentos, setDadosApontamentos] = useState([]);
  const [buscaApontamento, setBuscaApontamento] = useState("");

  const carregarDados = useCallback(async () => {
    if (!opId || Number.isNaN(opId)) return;
    setLoading(true);
    try {
      const [opDados, eventosRaw, apontamentosRaw] = await Promise.all([
        opCrudService.getById(opId),
        opCrudService.getHistoricoEventos(opId),
        opCrudService.getApontamentos(opId),
      ]);

      setOp(opDados);

      const eventos = (eventosRaw || []).map((item) => ({
        ...item,
        data: formatarPeriodo(item.inicio, item.fim),
        duracao: formatarDuracao(item.duracao_minutos),
      }));

      const apontamentos = (apontamentosRaw || []).map((item) => ({
        ...item,
        data: formatarPeriodo(item.inicio, item.fim),
      }));

      setTodosEventos(eventos);
      setDadosEventos(eventos);
      setTodosApontamentos(apontamentos);
      setDadosApontamentos(apontamentos);
    } catch (error) {
      console.error("Erro ao carregar OP:", error);
    } finally {
      setLoading(false);
    }
  }, [opId]);

  useEffect(() => {
    carregarDados();
  }, [carregarDados]);

  // Eventos: Ordenação e Filtro
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

  const aplicarFiltrosEventos = (filtrosSelecionados) => {
    let dadosFiltrados = [...todosEventos];
    if (filtrosSelecionados.tipo?.length) {
      dadosFiltrados = dadosFiltrados.filter((e) => filtrosSelecionados.tipo.includes(e.tipo));
    }
    if (filtrosSelecionados.data?.start) {
      dadosFiltrados = dadosFiltrados.filter((e) => new Date(e.inicio) >= new Date(filtrosSelecionados.data.start));
    }
    if (filtrosSelecionados.data?.end) {
      dadosFiltrados = dadosFiltrados.filter((e) => new Date(e.inicio) <= new Date(filtrosSelecionados.data.end));
    }
    if (filtrosSelecionados.duracao?.max) {
      dadosFiltrados = filtrarPorDuracaoMax(dadosFiltrados, filtrosSelecionados.duracao.max);
    }
    setDadosEventos(dadosFiltrados);
  };

  const eventosExibidos = dadosEventos.filter((evento) => {
    const termo = buscaEvento.toLowerCase();
    return (
      evento.tipo?.toLowerCase().includes(termo) ||
      evento.motivo?.toLowerCase().includes(termo) ||
      String(evento.id).includes(termo)
    );
  });

  // Apontamentos: Ordenação e Filtro
  const handleSortApontamento = (criterio) => {
    const copia = [...dadosApontamentos];
    copia.sort((a, b) => {
      if (criterio === "id_asc") return a.id - b.id;
      if (criterio === "id_desc") return b.id - a.id;
      if (criterio === "produzido_asc") return Number(a.produzido) - Number(b.produzido);
      if (criterio === "produzido_desc") return Number(b.produzido) - Number(a.produzido);
      if (criterio === "refugo_asc") return Number(a.refugo) - Number(b.refugo);
      if (criterio === "refugo_desc") return Number(b.refugo) - Number(a.refugo);
      return 0;
    });
    setDadosApontamentos(copia);
  };

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
    setDadosApontamentos(dadosFiltrados);
  };

  const apontamentosExibidos = dadosApontamentos.filter((a) =>
    String(a.id).includes(buscaApontamento.toLowerCase()) || (a.observacao?.toLowerCase() || "").includes(buscaApontamento.toLowerCase())
  );

  if (loading) {
    return <LoadingState message="Carregando ordem de produção..." />;
  }

  if (!op) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-8">
        <p className="text-red-500 text-lg">Ordem não encontrada</p>
        <Link href="/operador/ordensDeProducao" className="mt-4 text-blue-900 underline">
          Voltar para Ordens de Produção
        </Link>
      </main>
    );
  }

  const maquina = op?.maquina;
  const tituloOp = op?.codigo_lote || op?.nome || `OP #${opId}`;

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

  return (
    <PageLayout>
      <DetailPageContainer>
        <DetailBackLink href="/operador/ordensDeProducao" label="Voltar para Ordens de Produção" />

        <EntityProfileCard
          name={`Ordem de Produção ${tituloOp}`}
          imageSrc={imagemMaquina}
          imageAlt={maquina?.nome || "Máquina"}
          imageShape="square"
          imageFallback="/demo_maq.png"
          fieldsLeft={[
            { label: "ID", value: opId },
            { label: "Produto", value: op.nome || op.produto || "Não Informado" },
            { label: "Lote", value: op.codigo_lote || "Não Informado" },
            { label: "Máquina", value: maquina?.nome || "Não Informada" },
            { label: "Meta Planejada", value: `${op.qtd_planejada ?? 0} peças` },
          ]}
          fieldsRight={[
            { label: "Status", value: statusBadge(op.status_op) },
            { label: "Prioridade", value: prioridadeBadge(op.prioridade) },
            { label: "Início", value: formatarDataHora(op.data_inicio) },
            { label: "Prazo Final", value: formatarDataHora(op.data_fim) },
            
          ]}
          actions={
            <DetailActions>
              <Dialog>
                <DialogTrigger className="bg-secondary-foreground px-4 py-1.5 rounded-md flex items-center text-white text-xl font-semibold cursor-pointer">
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
                <DialogTrigger className="bg-(--chart2) px-7 py-1.5 rounded-md flex items-center text-white text-xl font-semibold cursor-pointer">
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

        <DetailSectionTitle title="Produção" />

        <AsymmetricGrid side="right">
          <DetailWidgetCard className="flex justify-center items-center">
            <OPProgressoWidget opId={opId} />
          </DetailWidgetCard>
          <DetailWidgetCard>
            <OPOEEDetalheWidget opId={opId} maquinaId={op?.id_maquina ?? maquina?.id_maquina} />
          </DetailWidgetCard>
        </AsymmetricGrid>

        <ListingTabs
          className="mt-4"
          activeTab={activeListTab}
          onChange={setActiveListTab}
          tabs={[
            { id: "eventos", label: "Histórico de Eventos" },
            { id: "apontamentos", label: "Histórico de Apontamentos" },
          ]}
        />

        {activeListTab === "eventos" ? (
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
                count={eventosExibidos.length}
                label="eventos"
                actions={
                  <>
                    <OrdenarDropdown
                      label="Ordenar por"
                      options={[
                        { label: "ID Crescente", value: "id_asc" },
                        { label: "ID Decrescente", value: "id_desc" },
                        { label: "Data Crescente", value: "data_asc" },
                        { label: "Data Decrescente", value: "data_desc" },
                        { label: "Duração Crescente", value: "duracao_asc" },
                        { label: "Duração Decrescente", value: "duracao_desc" },
                      ]}
                      onSortChange={handleSortEventos}
                    />
                    <FilterDropdown
                      filtersConfig={[
                        { id: "tipo", label: "Tipo", type: "checkbox", options: ["Parada", "Setup"] },
                        { id: "data", label: "Data", type: "date-range" },
                        { id: "duracao", label: "Duração máx.", type: "time-max" },
                      ]}
                      onApply={aplicarFiltrosEventos}
                    />
                  </>
                }
              />
            }
          >
            <FadeUpItem>
              {eventosExibidos.length > 0 ? (
                <TableListagens
                  data={eventosExibidos}
                  columns={[
                    { id: "id", key: "id", label: "ID", className: "w-20 text-center justify-center" },
                    {
                      id: "tipo",
                      key: "tipo",
                      label: "Status",
                      className: "text-center justify-center",
                      icone: (valor) => {
                        const config = {
                          Setup: { variant: "setup" },
                          Parada: { variant: "parada" },
                        };
                        const estilo = config[valor] || { variant: "outline" };
                        return (
                          <Badge variant={estilo.variant} className="whitespace-nowrap text-sm font-medium p-2.5">
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
                  ]}
                  acoesDropdown={(evento) => (
                    <Dialog>
                      <DialogTrigger asChild>
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="cursor-pointer">
                          <EyeIcon className="mr-2 h-4 w-4 text-primary" />
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
                <EmptyState title="Nenhum evento encontrado" message="Não há eventos para esta ordem." />
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
                  placeholder="Busque por id..."
                />
              }
              filterRow={
                <FilterRow
                  count={apontamentosExibidos.length}
                  label="apontamentos"
                  actions={
                    <>
                      <OrdenarDropdown
                        label="Ordenar por"
                        options={[
                          { label: "ID Crescente", value: "id_asc" },
                          { label: "ID Decrescente", value: "id_desc" },
                          { label: "Produzido Crescente", value: "produzido_asc" },
                          { label: "Produzido Decrescente", value: "produzido_desc" },
                          { label: "Refugo Crescente", value: "refugo_asc" },
                          { label: "Refugo Decrescente", value: "refugo_desc" },
                        ]}
                        onSortChange={handleSortApontamento}
                      />
                      <FilterDropdown
                        filtersConfig={[
                          { id: "produzido", label: "Produzido", type: "number-range" },
                          { id: "refugo", label: "Refugo", type: "number-range" },
                        ]}
                        onApply={aplicarFiltrosApontamento}
                      />
                    </>
                  }
                />
              }
            >
              {apontamentosExibidos.length > 0 ? (
                <TableListagens
                  data={apontamentosExibidos}
                  columns={[
                    { id: "id", key: "id", label: "ID", className: "w-20 text-center justify-center" },
                    { id: "data", key: "data", label: "Data (Início - Fim)" },
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
                  ]}
                />
              ) : (
                <EmptyState title="Nenhum apontamento encontrado" message="Não há apontamentos para esta ordem." />
              )}
            </DetailListingSection>
          </FadeUpItem>
        )}
      </DetailPageContainer>
    </PageLayout>
  );
}
