"use client"

import { MotivoRefugoMaquinaWidget } from "@/features/maquinas/MotivoRefugoMaquinaWidget";
import { MotivoSetupMaquinaWidget } from "@/features/maquinas/MotivoSetupMaquinaWidget";
import { OEEMaquinaWidget } from "@/features/maquinas/OEEMaquinaWidget";
import { OEEEvolucaoMaquinaWidget } from "@/features/maquinas/OEEEvolucaoMaquinaWidget";
import { VelocidadeMaquinaWidget } from "@/features/maquinas/VelocidadeMaquinaWidget";

import TableListagens from "@/components/table";
import { Badge } from "@/components/ui/badge";
import { DuracaoEvento } from "@/components/ui/duracaoEvento";
import { DataEvento } from "@/components/ui/dataEvento";

import { BellRing, Pencil, EyeIcon, Trash2, Plus, Search, Loader2, CloudBackup } from "lucide-react";
import { use, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import FormExclusaoMaquina from "@/components/ui/forms/maquinas/formExclusaoMaquina";
import FormEdicaoMaquina from "@/components/ui/forms/maquinas/formEdicaoMaquina";
import FormCadastroEvento from "@/components/ui/forms/historicoEventos/formCadastroEvento";
import OrdenarDropdown from "@/components/ui/OrdenarDropdown";
import FilterDropdown from "@/components/ui/FilterDropdown";
import { SolicitarJustificativaMenuItem } from "@/components/ui/forms/historicoEventos/solicitarJustificativaDialog";
import FormEdicaoEvento from "@/components/ui/forms/historicoEventos/formEdicaoEvento";
import { maquinaCrudService } from "@/services/maquinaCrudService";
import { apiFetch } from "@/lib/api";
import SyncPlacaDialog from "@/components/ui/forms/maquinas/SyncPlacaDialog";
import {
  filtrarPorDuracaoMax,
  filtrarPorNumberRange,
  duracaoEmMinutos,
} from "@/lib/filterUtils";
import DetalhesEvento from "@/components/ui/forms/historicoEventos/modalDetalhesEvento";

// Layout geral
import { PageLayout, SearchBar, FilterRow, EmptyState, AsymmetricGrid, FadeUpItem } from "@/components/AnimatedComponents";

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

// ─── Colunas ───────────────────────────────────────────────────────────────

const colunasMaquina = [
  { id: 'id', key: 'id', label: 'ID', className: 'w-20 text-center justify-center' },
  {
    id: 'tipo', key: 'tipoEvento', label: 'Tipo', className: 'text-center justify-center',
    icone: (valor) => {
      const config = {
        "Produzindo": { variant: "produzindo" },
        "Setup": { variant: "setup" },
        "Parada": { variant: "parada" },
        "Concluída": { variant: "concluida" },
        "Aguardando": { variant: "aguardando" }
      };
      const item = config[valor] || { icon: null };
      return (
        <Badge variant={item.variant} className={`whitespace-nowrap ${item.className} text-sm p-2.5`}>
          {item.icon}
          {valor}
        </Badge>
      );
    }
  },
  {
    id: 'data', key: 'data', label: 'Data (Início - Fim)',
    icone: (_, row) => <DataEvento inicio={row.inicio} fim={row.fim} />,
  },
  {
    id: 'duracao', key: 'duracao', label: 'Duração',
    icone: (_, row) => <DuracaoEvento inicio={row.inicio} fim={row.fim} />,
  },
  { id: 'motivo', key: 'motivo', label: 'Motivo' },
  { id: 'observacao', key: 'observacao', label: 'Observação' },
];

const colunasApontamento = [
  { id: 'id', key: 'id', label: 'ID', className: 'w-20 text-center justify-center' },
  { id: 'op', key: 'op', label: 'OP Afetada', className: 'w-30 text-center justify-center pl-5' },
  {
    id: 'data', key: 'data', label: 'Data (Início - Fim)', className: 'pl-10',
    icone: (_, row) => <DataEvento inicio={row.inicio} fim={row.fim} />,
  },
  {
    id: 'produzido', key: 'produzido', label: 'Produzido', className: 'text-center justify-center',
    icone: (valor) => (
      <Badge variant="outline" className="bg-green-500/15 text-green-600 text-sm font-semibold border-none">{valor}</Badge>
    ),
  },
  {
    id: 'refugo', key: 'refugo', label: 'Refugo', className: 'text-center justify-center',
    icone: (valor) => (
      <Badge variant="destructive" className="font-semibold text-sm border-none">{valor}</Badge>
    ),
  },
  { id: 'observacao', key: 'observacao', label: 'Observação' },
];

// ─── Helpers ───────────────────────────────────────────────────────────────

const formatarData = (valor) => (!valor ? "Não Informada" : new Date(valor).toLocaleDateString("pt-BR"));
const formatarPeriodo = (inicio, fim) => {
  if (!inicio) return "-";
  const di = new Date(inicio);
  const df = fim ? new Date(fim) : null;
  const data = di.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
  const hi = di.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  const hf = df ? df.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }) : "--:--";
  return `${data} (${hi} - ${hf})`;
};
const formatarDuracao = (minutos) => {
  const total = Number(minutos) || 0;
  const h = Math.floor(total / 60);
  const m = Math.round(total % 60);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
};
const parseData = (dataStr) => {
  const [dataParte] = dataStr.split(" ");
  const [dia, mes] = dataParte.split("/");
  return new Date(`2025-${mes}-${dia}`);
};

// ─── Opções de ordenação ───────────────────────────────────────────────────

const opcoesOrdenacaoEventos = [
  { label: 'ID Crescente', value: 'id_asc' },
  { label: 'ID Decrescente', value: 'id_desc' },
  { label: 'Data Crescente', value: 'data_asc' },
  { label: 'Data Decrescente', value: 'data_desc' },
  { label: 'Duração Crescente', value: 'duracao_asc' },
  { label: 'Duração Decrescente', value: 'duracao_desc' },
];

const opcoesOrdenacaoApontamento = [
  { label: 'ID Crescente', value: 'id_asc' },
  { label: 'ID Decrescente', value: 'id_desc' },
  { label: 'OP Afetada Crescente', value: 'opAfetada_asc' },
  { label: 'OP Afetada Decrescente', value: 'opAfetada_desc' },
  { label: 'Produzido Crescente', value: 'produzido_asc' },
  { label: 'Produzido Decrescente', value: 'produzido_desc' },
  { label: 'Refugo Crescente', value: 'refugo_asc' },
  { label: 'Refugo Decrescente', value: 'refugo_desc' },
];

const eventosFilter = [
  { id: "tipoEvento", label: "Tipo", type: "checkbox", options: ["Parada", "Setup"] },
  { id: "data", label: "Data", type: "date-range" },
];

const apontamentoFilter = [
  { id: "data", label: "Data", type: "date-range" },
  { id: "produzido", label: "Produzido", type: "number-range" },
  { id: "refugo", label: "Refugo", type: "number-range" },
];

// ─── Página ────────────────────────────────────────────────────────────────

export default function MaquinaDetalhePage({ params }) {
  const { id } = use(params);
  const router = useRouter();
  const maquinaId = Number(id);

  const [maquina, setMaquina] = useState(null);
  const [dados, setDados] = useState([]);
  const [dadosApontamentoState, setDadosApontamentoState] = useState([]);
  const [todosEventos, setTodosEventos] = useState([]);
  const [todosApontamentos, setTodosApontamentos] = useState([]);
  const [loadingMaquina, setLoadingMaquina] = useState(true);
  const [velocidade, setVelocidade] = useState("");
  const [buscaEvento, setBuscaEvento] = useState("");
  const [buscaApontamento, setBuscaApontamento] = useState("");
  const [activeListTab, setActiveListTab] = useState("eventos");

  const imagemMaquina = (() => {
    const apiUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001").replace(/\/$/, "");
    if (!maquina?.imagem) return "/demo_maq.png";
    const imagem = String(maquina.imagem).replaceAll("\\", "/");
    if (imagem.startsWith("http")) return imagem;
    if (imagem.startsWith("/uploads/")) return `${apiUrl}${imagem}`;
    const nomeArquivo = imagem.split("/").pop();
    return `${apiUrl}/uploads/imagens/${nomeArquivo}`;
  })();

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
            tipoEvento: item.tipo,
            data: formatarPeriodo(item.inicio, item.fim),
            duracao: formatarDuracao(item.duracao_minutos),
            motivo: item.motivo || "-",
          }));
        const apontamentos = historico
          .filter((item) => item.tipo === "Producao")
          .map((item) => ({
            ...item,
            op: item.ordem_producao?.codigo_lote || item.ordem_producao?.id_ordem || "-",
            id_ordem: item.ordem_producao?.id_ordem ?? null,
            data: formatarPeriodo(item.inicio, item.fim),
            duracao: formatarDuracao(item.duracao_minutos),
            produzido: String(item.produzido || 0),
            refugo: String(item.refugo || 0),
            observacao: item.motivo || "-",
          }));
        setTodosEventos(eventos);
        setDados(eventos);
        setTodosApontamentos(apontamentos);
        setDadosApontamentoState(apontamentos);
      } finally {
        setLoadingMaquina(false);
      }
    }
    if (maquinaId) carregarMaquina();
  }, [maquinaId]);

  useEffect(() => {
    async function carregar() {
      try {
        if (!maquinaId) return;
        const dados = await apiFetch(`/api/maquinas/${maquinaId}/velocidade`, { method: "GET" });
        setVelocidade(dados.dados);
      } catch (error) {
        console.log(error);
      }
    }
    carregar();
  }, [maquinaId]);

  // Ordenação eventos
  const handleSortEventos = (criterio) => {
    const copia = [...dados];
    copia.sort((a, b) => {
      if (criterio === 'id_asc') return a.id - b.id;
      if (criterio === 'id_desc') return b.id - a.id;
      if (criterio === 'data_asc') return parseData(a.data) - parseData(b.data);
      if (criterio === 'data_desc') return parseData(b.data) - parseData(a.data);
      if (criterio === 'duracao_asc') { const [hA, mA] = a.duracao.split(':').map(Number); const [hB, mB] = b.duracao.split(':').map(Number); return (hA * 60 + mA) - (hB * 60 + mB); }
      if (criterio === 'duracao_desc') { const [hA, mA] = a.duracao.split(':').map(Number); const [hB, mB] = b.duracao.split(':').map(Number); return (hB * 60 + mB) - (hA * 60 + mA); }
      return 0;
    });
    setDados(copia);
  };


  //filtros para eventos
  const eventosFilter = [
    { id: "tipoEvento", label: "Tipo", type: "checkbox", options: ["Parada", "Setup"] },
    { id: "data", label: "Data", type: "date-range" },
    { id: "duracao", label: "Duração máx.", type: "time-max" },
  ];

  const aplicarFiltrosEventos = (filtrosSelecionados) => {
    let dadosFiltrados = [...todosEventos];

    // filtro por status
    if (filtrosSelecionados.tipoEvento?.length) {
      dadosFiltrados = dadosFiltrados.filter(evento =>
        filtrosSelecionados.tipoEvento.includes(evento.tipoEvento)
      );
    }

    // filtro por data
    if (filtrosSelecionados.data) {
      if (filtrosSelecionados.data.start) {
        dadosFiltrados = dadosFiltrados.filter(evento =>
          parseData(evento.data) >= new Date(filtrosSelecionados.data.start)
        );
      }

      if (filtrosSelecionados.data.end) {
        dadosFiltrados = dadosFiltrados.filter(evento =>
          parseData(evento.data) <= new Date(filtrosSelecionados.data.end)
        );
      }
    }

    if (filtrosSelecionados.duracao?.max) {
      dadosFiltrados = filtrarPorDuracaoMax(
        dadosFiltrados.map((e) => ({ ...e, inicio: e.inicio ?? parseData(e.data), fim: e.fim })),
        filtrosSelecionados.duracao.max
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
      evento.id?.toString().includes(termo)
    );
  });

  // Ordenação apontamentos
  const handleSortApontamento = (criterio) => {
    const copia = [...dadosApontamentoState];
    copia.sort((a, b) => {
      if (criterio === 'id_asc') return a.id - b.id;
      if (criterio === 'id_desc') return b.id - a.id;
      if (criterio === 'opAfetada_asc') return Number(a.op) - Number(b.op);
      if (criterio === 'opAfetada_desc') return Number(b.op) - Number(a.op);
      if (criterio === 'produzido_asc') return Number(a.produzido) - Number(b.produzido);
      if (criterio === 'produzido_desc') return Number(b.produzido) - Number(a.produzido);
      if (criterio === 'refugo_asc') return Number(a.refugo) - Number(b.refugo);
      if (criterio === 'refugo_desc') return Number(b.refugo) - Number(a.refugo);
      return 0;
    });
    setDadosApontamentoState(copia);
  };


  //filtros para apontamentos
  const apontamentoFilter = [
    { id: "data", label: "Data", type: "date-range" },
    { id: "produzido", label: "Produzido", type: "number-range" },
    { id: "refugo", label: "Refugo", type: "number-range" }
  ];

  const aplicarFiltrosApontamento = (filtrosSelecionados) => {
    let dadosFiltrados = [...todosApontamentos];

    if (filtrosSelecionados.data?.start) {
      dadosFiltrados = dadosFiltrados.filter((a) =>
        parseData(a.data ?? a.inicio) >= new Date(filtrosSelecionados.data.start)
      );
    }
    if (filtrosSelecionados.data?.end) {
      dadosFiltrados = dadosFiltrados.filter((a) =>
        parseData(a.data ?? a.inicio) <= new Date(filtrosSelecionados.data.end)
      );
    }

    dadosFiltrados = filtrarPorNumberRange(dadosFiltrados, "produzido", filtrosSelecionados.produzido);
    dadosFiltrados = filtrarPorNumberRange(dadosFiltrados, "refugo", filtrosSelecionados.refugo);

    setDadosApontamentoState(dadosFiltrados);
  };

  const dadosApontamentosFiltrados = dadosApontamentoState.filter((a) => {
    const t = buscaApontamento.toLowerCase();
    return String(a.op || "").toLowerCase().includes(t) || a.id?.toString().includes(t);
  });

  if (loadingMaquina) {
    return (
      <main className="min-h-screen bg-[url('/bg_app.svg')] bg-cover bg-fixed bg-center bg-no-repeat flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-900 mb-4" />
          <p className="text-lg text-gray-600 font-medium">Sincronizando dados da máquina...</p>
        </div>
      </main>
    );
  }

  return (
    <PageLayout>
      <DetailPageContainer>

        {/* Voltar */}
        <DetailBackLink href="/adm/maquinas" label="Voltar para Máquinas" />

        {/* Perfil da Máquina */}
        <MachineProfileCard
          machineName={maquina?.nome || `Máquina ${maquinaId}`}
          imageSrc={imagemMaquina}
          fieldsLeft={[
            { label: "ID", value: maquina?.id_maquina || maquinaId },
            { label: "Série", value: maquina?.serie || "Não Informado" },
            { label: "Setor", value: maquina?.id_setor || "Sem setor atribuído" },
            {
              label: "Status",
              value: <StatusBadge status={maquina?.status_atual || maquina?.status || "Parada"} />,
            },
          ]}
          fieldsRight={[
            { label: "Operador", value: maquina?.id_operador || "Sem operador atribuído" },
            { label: "Data de Aquisição", value: formatarData(maquina?.data_aquisicao) || "Não Informada"},
            { label: "Velocidade Média", value: velocidade?.velocidade_atual || "Não Informada" },
          ]}
          actions={
            <DetailActions>
              <SyncPlacaDialog maquinaId={maquinaId} iconSize={36} />
              <Dialog>
                <DialogTrigger className="text-(--pencil) cursor-pointer">
                  <Pencil size={32} />
                </DialogTrigger>
                <DialogContent>
                  <FormEdicaoMaquina maquinaId={maquinaId} />
                </DialogContent>
              </Dialog>
              <Dialog>
                <DialogTrigger className="text-(--trash) cursor-pointer">
                  <Trash2 size={32} />
                </DialogTrigger>
                <DialogContent>
                  <FormExclusaoMaquina
                    maquinaId={maquinaId}
                    onExcluir={maquinaCrudService.delete}
                    onExclusaoSucesso={() => router.push("/adm/maquinas")}
                  />
                </DialogContent>
              </Dialog>
            </DetailActions>
          }
        />

        {/* Seção Produção */}
        <DetailSectionTitle title="Produção" />

        <AsymmetricGrid>
          <DetailWidgetCard className="flex justify-center items-center">
            <OEEEvolucaoMaquinaWidget maquinaId={maquinaId} />
          </DetailWidgetCard>
          <SectionHighlight>
            <OEEMaquinaWidget maquinaId={maquinaId} />
          </SectionHighlight>

        </AsymmetricGrid>

        <DetailWidgetGrid cols={3}>
          <DetailWidgetCard>
            <MotivoSetupMaquinaWidget maquinaId={maquinaId} />
          </DetailWidgetCard>
          <DetailWidgetCard>
            <MotivoRefugoMaquinaWidget maquinaId={maquinaId} />
          </DetailWidgetCard>
          <DetailWidgetCard>
            <VelocidadeMaquinaWidget maquinaId={maquinaId} />
          </DetailWidgetCard>
        </DetailWidgetGrid>

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
                  <Plus size={20} />
                  Cadastrar
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
                placeholder="Busque por tipo, motivo ou id..."
              />
            }
            filterRow={
              <FilterRow
                count={dadosExibidos.length}
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
            <FadeUpItem>
              {dadosExibidos.length > 0 ? (
                <TableListagens
                  data={dadosExibidos}
                  columns={colunasMaquina}
                  acoesDropdown={(maq) => (
                    <>
                      <Dialog>
                        <DialogTrigger asChild>
                          <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="cursor-pointer">
                            <EyeIcon strokeWidth={2} className="mr-1 h-4 w-4 text-primary" />
                            Ver Detalhes
                          </DropdownMenuItem>
                        </DialogTrigger>
                        <DialogContent><DetalhesEvento eventoId={maq.id} /></DialogContent>
                      </Dialog>
                      <SolicitarJustificativaMenuItem idEvento={maq.id}>
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="cursor-pointer">
                          <BellRing className="mr-2 h-4 w-4" />
                          Solicitar Justificativa
                        </DropdownMenuItem>
                      </SolicitarJustificativaMenuItem>
                      <Dialog>
                        <DialogTrigger asChild>
                          <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="cursor-pointer">
                            <Pencil className="mr-2 h-4 w-4 text-primary" />
                            Editar Evento
                          </DropdownMenuItem>
                        </DialogTrigger>
                        <DialogContent><FormEdicaoEvento /></DialogContent>
                      </Dialog>
                    </>
                  )}
                />
              ) : (
                <EmptyState title="Nenhum evento encontrado" message={`Sem eventos para "${buscaEvento}".`} />
              )}
            </FadeUpItem>
          </DetailListingSection>
        ) : (
          <DetailListingSection
            id="listagem_histApontamentos"
            title="Histórico de Apontamentos da Máquina"
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
            <FadeUpItem>
              {dadosApontamentosFiltrados.length > 0 ? (
                <TableListagens
                  data={dadosApontamentosFiltrados}
                  columns={colunasApontamento}
                  acoesDropdown={(apontamento) => (
                    <DropdownMenuItem asChild className="cursor-pointer">
                      <Link href={`/adm/ordensDeProducao/${apontamento.id_ordem || apontamento.op}`}>
                        <EyeIcon className="mr-2 h-4 w-4" />
                        Ver OP relacionada
                      </Link>
                    </DropdownMenuItem>
                  )}
                />
              ) : (
                <EmptyState
                  title="Nenhum apontamento encontrado"
                  message="Não encontramos apontamentos correspondentes ao filtro ou busca."
                />
              )}
            </FadeUpItem>
          </DetailListingSection>
        )}

      </DetailPageContainer>
    </PageLayout>
  );
}