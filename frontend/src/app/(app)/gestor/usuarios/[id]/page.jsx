"use client";

import { use, useState, useEffect, useCallback } from "react";
import Link from "next/link";

import { EyeIcon, Pencil, Trash2 } from "lucide-react";

import { MetaProducaoWidget } from "@/features/operador/MetaProducaoWidget";
import { TempoParadoTempoProduzindoOperadorWidget } from "@/features/operador/TempoParadoTempoProduzindoOperadorWidget";
import { OEEOperadorWidget } from "@/features/operador/OEEOperadorWidget";
import { PecasPorDiaWidget } from "@/features/operador/PecasPorDiaWidget";
import { ProducaoPorHoraOperadorWidget } from "@/features/operador/ProducaoPorHoraOperadorWidget";
import { EficienciaMaquinaWidget } from "@/features/operador/EficienciaMaquinaWidget";

import TableListagens from "@/components/table";
import { DataEvento } from "@/components/ui/dataEvento";
import { Badge } from "@/components/ui/badge";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import FilterDropdown from "@/components/ui/FilterDropdown";
import OrdenarDropdown from "@/components/ui/OrdenarDropdown";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import FormEdicaoOperadorGestor from "@/components/ui/forms/usuarios/formEdicaoOperadorGestor";
import FormExclusaoUsuario from "@/components/ui/forms/usuarios/formExclusaoUsuario";
import { apiFetch } from "@/lib/api";
import { usuariosCrudService } from "@/services/usuariosCrudService";

import {
  PageLayout,
  SearchBar,
  FilterRow,
  EmptyState,
  LoadingState,
} from "@/components/AnimatedComponents";

import {
  DetailPageContainer,
  DetailBackLink,
  UserProfileCard,
  MachineProfileCard,
  DetailSectionTitle,
  DetailWidgetGrid,
  DetailWidgetCard,
  SectionHighlight,
  DetailListingSection,
  DetailActions,
} from "@/components/DetailComponents";

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
    icone: (valor, row) => <DataEvento inicio={row.inicio} fim={row.fim} />,
  },
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

const resolverImagemPerfil = (imagem) => {
  if (!imagem) return "/userdefault.svg";
  if (imagem.startsWith("http")) return imagem;

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
  if (imagem.startsWith("/uploads/")) return `${apiUrl}${imagem}`;

  return `${apiUrl}/uploads/imagens/${imagem}`;
};

export default function UsuarioDetalheGestor({ params }) {
  const { id } = use(params);
  const operadorId = Number(id);

  const [usuario, setUsuario] = useState(null);
  const [carregando, setSincronizando] = useState(true);
  const [dadosApontamentoState, setDadosApontamentoState] = useState([]);
  const [todosApontamentos, setTodosApontamentos] = useState([]);
  const [buscaApontamento, setBuscaApontamento] = useState("");

  const carregarDados = useCallback(async () => {
    setSincronizando(true);
    try {
      const [usuarioDados, apontamentosResp] = await Promise.all([
        usuariosCrudService.getById(operadorId),
        apiFetch(`/api/usuarios/${operadorId}/apontamentos`, { method: "GET" }),
      ]);

      setUsuario(usuarioDados);

      const apontamentos = (apontamentosResp.dados || []).map((item) => ({
        ...item,
        data: item.inicio ? formatarPeriodo(item.inicio, item.fim) : item.data,
      }));

      setTodosApontamentos(apontamentos);
      setDadosApontamentoState(apontamentos);
    } catch (error) {
      console.error("Erro ao carregar usuário:", error);
    } finally {
      setSincronizando(false);
    }
  }, [operadorId]);

  useEffect(() => {
    if (operadorId) carregarDados();
  }, [operadorId, carregarDados]);

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

  const handleSortApontamento = (criterio) => {
    const dadosCopiados = [...dadosApontamentoState];

    dadosCopiados.sort((a, b) => {
      if (criterio === "id_asc") return a.id - b.id;
      if (criterio === "id_desc") return b.id - a.id;
      if (criterio === "opAfetada_asc") return String(a.op).localeCompare(String(b.op));
      if (criterio === "opAfetada_desc") return String(b.op).localeCompare(String(a.op));
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
  ];

  const aplicarFiltrosApontamento = (filtrosSelecionados) => {
    let dadosFiltrados = [...todosApontamentos];

    if (filtrosSelecionados.produzido?.min != null) {
      dadosFiltrados = dadosFiltrados.filter(
        (a) => Number(a.produzido) >= filtrosSelecionados.produzido.min,
      );
    }
    if (filtrosSelecionados.produzido?.max != null) {
      dadosFiltrados = dadosFiltrados.filter(
        (a) => Number(a.produzido) <= filtrosSelecionados.produzido.max,
      );
    }
    if (filtrosSelecionados.refugo?.min != null) {
      dadosFiltrados = dadosFiltrados.filter(
        (a) => Number(a.refugo) >= filtrosSelecionados.refugo.min,
      );
    }
    if (filtrosSelecionados.refugo?.max != null) {
      dadosFiltrados = dadosFiltrados.filter(
        (a) => Number(a.refugo) <= filtrosSelecionados.refugo.max,
      );
    }
    if (filtrosSelecionados.data?.start) {
      dadosFiltrados = dadosFiltrados.filter(
        (a) => new Date(a.inicio) >= new Date(filtrosSelecionados.data.start),
      );
    }
    if (filtrosSelecionados.data?.end) {
      dadosFiltrados = dadosFiltrados.filter(
        (a) => new Date(a.inicio) <= new Date(filtrosSelecionados.data.end),
      );
    }

    setDadosApontamentoState(dadosFiltrados);
  };

  const dadosApontamentosFiltrados = dadosApontamentoState.filter((a) => {
    const termo = buscaApontamento.toLowerCase();
    return String(a.op).toLowerCase().includes(termo) || String(a.id).includes(termo);
  });

  if (carregando) {
    return (
      <PageLayout>
        <LoadingState message="Sincronizando dados do usuário..." />
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <DetailPageContainer>
        <DetailBackLink href="/gestor/usuarios" label="Voltar para Usuários" />

        <UserProfileCard
          imageSrc={resolverImagemPerfil(usuario?.imagem_perfil)}
          name={usuario?.nome || "Não informado"}
          fieldsLeft={[
            { label: "ID", value: String(usuario?.id_usuario || operadorId) },
            { label: "Email", value: usuario?.email || "Não informado" },
            { label: "CPF", value: usuario?.cpf || "Não informado" },
          ]}
          fieldsRight={[
            { label: "Setor", value: usuario?.setor?.nome_setor || "Não informado" },
            { label: "Função", value: usuario?.tipo || usuario?.funcao || "Não informado" },
            { label: "Turno", value: usuario?.turno?.nome_turno || "Não informado" },
          ]}
          actions={
            <DetailActions>
              <Dialog>
                <DialogTrigger className="text-[var(--pencil)] cursor-pointer">
                  <Pencil size={36} className="mr-1" />
                </DialogTrigger>
                <DialogContent>
                  <FormEdicaoOperadorGestor
                    operadorId={operadorId}
                    onEdicaoSucesso={carregarDados}
                  />
                </DialogContent>
              </Dialog>

              <Dialog>
                <DialogTrigger className="text-[var(--trash)] cursor-pointer">
                  <Trash2 className="w-9 h-9" />
                </DialogTrigger>
                <DialogContent>
                  <FormExclusaoUsuario usuarioId={operadorId} />
                </DialogContent>
              </Dialog>
            </DetailActions>
          }
        />

        {usuario?.maquina && (
          <section id="maquina_responsavel" className="mt-5">
            <DetailSectionTitle title="Responsável por:" size="2xl" />
            <Link
              href={
                usuario.maquina.id_maquina
                  ? `/gestor/maquinas/${usuario.maquina.id_maquina}`
                  : "#"
              }
              className="block mt-4"
            >
              <MachineProfileCard
                machineName={usuario.maquina.nome || "Não informado"}
                imageSrc="/demo_maq.png"
                imageAlt={usuario.maquina.nome || "Máquina"}
                fieldsLeft={[
                  { label: "ID", value: String(usuario.maquina.id_maquina || "-") },
                  { label: "Série", value: usuario.maquina.serie || "Não informado" },
                ]}
                status={usuario.maquina.status_atual}
              />
            </Link>
          </section>
        )}

        <DetailSectionTitle title="Produção" />

        <SectionHighlight>
          <OEEOperadorWidget operadorId={operadorId} />
        </SectionHighlight>

        <DetailWidgetGrid cols={3}>
          <DetailWidgetCard>
            <PecasPorDiaWidget operadorId={operadorId} />
          </DetailWidgetCard>
          <DetailWidgetCard>
            <ProducaoPorHoraOperadorWidget operadorId={operadorId} />
          </DetailWidgetCard>
          <DetailWidgetCard centered>
            <MetaProducaoWidget operadorId={operadorId} />
          </DetailWidgetCard>
        </DetailWidgetGrid>

        <DetailWidgetGrid cols={2}>
          <DetailWidgetCard>
            <TempoParadoTempoProduzindoOperadorWidget operadorId={operadorId} />
          </DetailWidgetCard>
          <DetailWidgetCard>
            <EficienciaMaquinaWidget operadorId={operadorId} />
          </DetailWidgetCard>
        </DetailWidgetGrid>

        <DetailListingSection
          id="listagem_apontamentos"
          title="Histórico de Apontamentos Feitos pelo Usuário"
          search={
            <SearchBar
              value={buscaApontamento}
              onChange={(e) => setBuscaApontamento(e.target.value)}
              placeholder="Busque por OP ou id..."
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
                  <Link
                    href={`/gestor/ordensDeProducao/${apontamento.id_ordem || apontamento.op}`}
                  >
                    <EyeIcon className="mr-2 h-4 w-4" />
                    Ver OP relacionada
                  </Link>
                </DropdownMenuItem>
              )}
            />
          ) : (
            <EmptyState
              title="Nenhum apontamento encontrado"
              message={
                buscaApontamento
                  ? `Não encontramos resultados para "${buscaApontamento}".`
                  : "Não há apontamentos vinculados a este usuário."
              }
            />
          )}
        </DetailListingSection>
      </DetailPageContainer>
    </PageLayout>
  );
}
