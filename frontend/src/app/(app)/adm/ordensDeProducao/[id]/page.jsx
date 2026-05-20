"use client";
import Link from "next/link";
import Image from "next/image";
import { use, useState, useEffect } from "react";

import TableListagens from "@/components/table";
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
} from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";

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
 

export default function OPDetalhePage({ params }) {
  const { id } = use(params);
  const opId = id;

  const [buscaApontamento, setBuscaApontamento] = useState("");

  const parseData = (dataStr) => {
    const [dataParte] = dataStr.split(" ");
    const [dia, mes] = dataParte.split("/");

    // ano fixo (ajuste se precisar)
    return new Date(`2025-${mes}-${dia}`);
  };

  // -------------------------------------------------------------------------------------------------- Eventos --------------------------------------------------------------------------------------------------
  const colunasOP = [
    {
      id: "id",
      key: "id",
      label: "ID",
      className: "w-20 text-center justify-center",
    },
    {
      id: "status",
      key: "evento",
      label: "Status",
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
    { id: "data", key: "data", label: "Data (InÃ­cio - Fim)" },
    {
      id: "duracao",
      key: "duracao",
      label: "DuraÃ§Ã£o",
      className: "text-center justify-center",
    },
    { id: "motivo", key: "motivo", label: "Motivo" },
  ];

  const dadosOP = [
    {
      id: 1,
      evento: "Parada",
      data: "26/03 (08:00 - 09:00)",
      duracao: "00:35",
      motivo: "Troca de ferramenta",
    },
    {
      id: 2,
      evento: "Setup",
      data: "06/01 (09:30 - 10:15)",
      duracao: "00:45",
      motivo: "ManutenÃ§Ã£o corretiva",
    },
    {
      id: 3,
      evento: "Setup",
      data: "13/09 (10:15 - 10:35)",
      duracao: "00:20",
      motivo: "Ajuste de parÃ¢metros",
    },
    {
      id: 4,
      evento: "Parada",
      data: "30/09 (11:00 - 12:00)",
      duracao: "01:00",
      motivo: "Refugo elevado devido a falta de aquecimento",
    },
    {
      id: 5,
      evento: "Setup",
      data: "28/03 (12:00 - 14:00)",
      duracao: "01:00",
      motivo: "Retirada de amostras para o laboratÃ³rio de qualidade",
    },
    {
      id: 6,
      evento: "Setup",
      data: "30/07 (17:00 - 18:00)",
      duracao: "01:30",
      motivo: "FinalizaÃ§Ã£o de evento",
    },
    {
      id: 7,
      evento: "Parada",
      data: "20/09 (16:00 - 19:00)",
      duracao: "01:00",
      motivo: "Falta de material",
    },
    {
      id: 8,
      evento: "Parada",
      data: "20/09 (16:00 - 19:00)",
      duracao: "01:00",
      motivo: "Boa qualidade",
    },
  ];
  const [dadosEventos, setDadosEventos] = useState(dadosOP);
  const [buscaEvento, setBuscaEvento] = useState("");

  const opcoesOrdenacaoEventos = [
    { label: "ID Crescente", value: "id_asc" },
    { label: "ID Decrescente", value: "id_desc" },
    { label: "Data Crescente", value: "data_asc" },
    { label: "Data Decrescente", value: "data_desc" },
    { label: "DuraÃ§Ã£o Crescente", value: "duracao_asc" },
    { label: "DuraÃ§Ã£o Decrescente", value: "duracao_desc" },
  ];

  //lÃ³gica de ordenaÃ§Ã£o de Eventos
  const handleSortEventos = (criterio) => {
    const copia = [...dadosEventos];

    copia.sort((a, b) => {
      if (criterio === "id_asc") return a.id - b.id;
      if (criterio === "id_desc") return b.id - a.id;

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

    setDadosEventos(copia);
  };

  //filtros para eventos
  const eventosFilter = [
    {
      id: "evento",
      label: "Tipo",
      type: "checkbox",
      options: ["Parada", "Setup"],
    },
    { id: "data", label: "Data", type: "date-range" },
    // {id:"duracao", label:"DuraÃ§Ã£o", type:"time-max"} --> nÃ£o funcionou, tentei de vÃ¡rias formas mas o filtro por duraÃ§Ã£o nÃ£o funcionou, entÃ£o deixei comentado por enquanto. quem quiser tentar implementar depois, fique Ã  vontade!
  ];

  const aplicarFiltrosEventos = (filtrosSelecionados) => {
    let dadosFiltrados = [...dadosOP];

    if (filtrosSelecionados.evento?.length) {
      dadosFiltrados = dadosFiltrados.filter((e) =>
        filtrosSelecionados.evento.includes(e.evento),
      );
    }

    if (filtrosSelecionados.data) {
      if (filtrosSelecionados.data.start) {
        dadosFiltrados = dadosFiltrados.filter(
          (e) => parseData(e.data) >= new Date(filtrosSelecionados.data.start),
        );
      }

      if (filtrosSelecionados.data.end) {
        dadosFiltrados = dadosFiltrados.filter(
          (e) => parseData(e.data) <= new Date(filtrosSelecionados.data.end),
        );
      }
    }

    setDadosEventos(dadosFiltrados);
  };

  //filtra os dados atuais de EVENTOS (filtrados e ordenados) pelo termo de busca
  const dadosExibidos = dadosEventos.filter((evento) => {
    const termo = buscaEvento.toLowerCase();

    return (
      evento.evento?.toLowerCase().includes(termo) ||
      evento.motivo?.toLowerCase().includes(termo) ||
      evento.id?.toString().includes(termo)
    );
  });

  // -------------------------------------------------------------------------------------------------- Apontamentos  --------------------------------------------------------------------------------------------------
  const colunasApontamento = [
    {
      id: "id",
      key: "id",
      label: "ID",
      className: "w-20 text-center justify-center",
    },
    {
      id: "data",
      key: "data",
      label: "Data (InÃ­cio - Fim)",
      className: "pl-10",
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
    { id: "observacao", key: "observacao", label: "ObservaÃ§Ã£o" },
  ];

  const dadosApontamento = [
    {
      id: 1,
      op: "0098",
      data: "26/03 (08:00 - 09:00)",
      duracao: "00:35",
      produzido: "15",
      refugo: "2",
      observacao: "Troca de ferramenta",
    },
    {
      id: 2,
      op: "1234",
      data: "06/01 (09:30 - 10:15)",
      duracao: "00:45",
      produzido: "10",
      refugo: "5",
      observacao: "ManutenÃ§Ã£o corretiva",
    },
    {
      id: 3,
      op: "5678",
      data: "13/09 (10:15 - 10:35)",
      duracao: "00:20",
      produzido: "20",
      refugo: "1",
      observacao: "Ajuste de parÃ¢metros",
    },
    {
      id: 4,
      op: "9012",
      data: "30/09 (11:00 - 12:00)",
      duracao: "01:00",
      produzido: "5",
      refugo: "8",
      observacao: "Refugo elevado devido a falta de aquecimento",
    },
    {
      id: 5,
      op: "1223",
      data: "28/03 (12:00 - 14:00)",
      duracao: "01:00",
      produzido: "6",
      refugo: "8",
      observacao: "Retirada de amostras para o laboratÃ³rio de qualidade",
    },
    {
      id: 6,
      op: "1206",
      data: "30/07 (17:00 - 18:00)",
      duracao: "01:00",
      produzido: "13",
      refugo: "6",
      observacao: "FinalizaÃ§Ã£o de OP",
    },
    {
      id: 7,
      op: "8912",
      data: "20/09 (16:00 - 19:00)",
      duracao: "01:00",
      produzido: "20",
      refugo: "5",
      observacao: "Falta de material",
    },
    {
      id: 8,
      op: "0607",
      data: "20/09 (16:00 - 19:00)",
      duracao: "01:00",
      produzido: "20",
      refugo: "5",
      observacao: "Boa qualidade",
    },
  ];

  const [dadosApontamentoState, setDadosApontamentoState] = useState([]);

  useEffect(() => {
    setDadosApontamentoState(dadosApontamento);
  }, []);

  const opcoesOrdenacaoApontamento = [
    { label: "ID Crescente", value: "id_asc" },
    { label: "ID Decrescente", value: "id_desc" },
    { label: "Produzido Crescente", value: "produzido_asc" },
    { label: "Produzido Decrescente", value: "produzido_desc" },
    { label: "Refugo Crescente", value: "refugo_asc" },
    { label: "Refugo Decrescente", value: "refugo_desc" },
  ];

  //lÃ³gica de ordenaÃ§Ã£o de Apontamentos
  const handleSortApontamento = (criterio) => {
    const dadosCopiados = [...dadosApontamentoState];

    dadosCopiados.sort((a, b) => {
      if (criterio === "id_asc") return a.id - b.id;
      if (criterio === "id_desc") return b.id - a.id;

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
    let dadosFiltrados = [...dadosApontamentoState];

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
      (a.op?.toLowerCase() || "").includes(termo) ||
      a.id?.toString().includes(termo)
    );
  });

  return (
    <>
      <PageLayout>
        <DetailPageContainer>
          <DetailBackLink
            href="/adm/ordensDeProducao"
            label="Voltar para Ordens de Produção"
          />
          <DetailHeader
            title="Ordem de Produção #AAA550"
            actions={
              <DetailActions>
                <Dialog>
                  <DialogTrigger className="text-[var(--pencil)] cursor-pointer">
                    <Pencil size={36} className="mr-1" />
                  </DialogTrigger>
                  <DialogContent>
                    <FormEdicaoOp />
                  </DialogContent>
                </Dialog>

                <Dialog>
                  <DialogTrigger className="text-[var(--trash)] cursor-pointer">
                    <Trash2 className=" w-9 h-9" />
                  </DialogTrigger>
                  <DialogContent>
                    <FormExclusaoOp />
                  </DialogContent>
                </Dialog>
              </DetailActions>
            }
          />

          {/* SEÃ‡ÃƒO 1: Info card + Progresso */}
          <DetailWidgetGrid cols="2-1">
            <DetailWidgetCard colSpan="md:col-span-2">
              <DetailInfoCard layout="row">
                <DetailInfoColumn>
                  <DetailInfoField
                    label="Setor"
                    value={
                      <Link
                        href="/adm/setores/1"
                        className="hover:underline text-primary font-semibold"
                      >
                        Rosca
                      </Link>
                    }
                  />

                  <DetailInfoField
                    label="Status"
                    value={<StatusBadge status="Produzindo" />}
                  />

                  <DetailInfoField
                    label="Prioridade"
                    value={
                      <Badge
                        variant="outline"
                        className="border border-vermelho-vivido bg-transparent text-black text-sm font-medium"
                      >
                        <Flame className="text-vermelho-vivido mr-1" />
                        Crítica
                      </Badge>
                    }
                  />

                  <DetailInfoField
                    label="Operador"
                    value={
                      <Link
                        href="/adm/usuarios/1"
                        className="hover:underline text-primary font-semibold"
                      >
                        João Silva
                      </Link>
                    }
                  />

                  <DetailInfoField label="Início" value="26/03/2024 08:00" />
                  <DetailInfoField
                    label="Prazo Final"
                    value="26/03/2024 18:00"
                  />
                </DetailInfoColumn>
              </DetailInfoCard>
            </DetailWidgetCard>

            <DetailWidgetCard colSpan="md:col-span-1">
              <OPProgressoWidget opId={opId} />
            </DetailWidgetCard>
          </DetailWidgetGrid>

          {/* SEÃ‡ÃƒO 2: OEE Gauges */}
          <DetailWidgetCard>
            <OPOEEDetalheWidget opId={opId} />
          </DetailWidgetCard>

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
                count={dadosEventosExibidos.length}
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
              {dadosEventosExibidos.length > 0 ? (
                <TableListagens
                  /* Dados e colunas a depender da pÃ¡gina [no momento estÃ¡ estÃ¡tico definido em um json, posteriormente serÃ¡ um get]  */
                  data={dadosExibidos}
                  columns={colunasOP}
                  enableSelection={true}
                  onEditSelected={(rows) => handleEditBatch(rows)}
                  acoesDropdown={(ordemProd) => (
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
                          <DetalhesEvento eventoId={ordemProd.op} />
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
                          <FormEdicaoEvento />
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
        </DetailPageContainer>
      </PageLayout>
    </>
  );
}
