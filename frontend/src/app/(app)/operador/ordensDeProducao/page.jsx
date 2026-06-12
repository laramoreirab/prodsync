"use client";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState, useEffect, useMemo } from "react";
import { useOps } from "@/hooks/useOps";
import { Badge } from "@/components/ui/badge";
import {
  AlertTriangle,
  ArrowDown,
  Flame,
  MoveHorizontal,
  Pencil,
  Plus,
  Search,
  Loader2,
  EyeIcon,
  Trash2,
} from "lucide-react";
import TableListagens from "@/components/table";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import OrdenarDropdown from "@/components/ui/OrdenarDropdown";
import FilterDropdown from "@/components/ui/FilterDropdown";
import { filtrarPorNumberRange } from "@/lib/filterUtils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { OPProgressoCell } from "@/features/ordens/OPProgressoCell";
import { MetaProducaoWidget } from "@/features/operador/MetaProducaoWidget";
import { getUserFromToken } from "@/lib/auth";
import {
  PageLayout,
  PageHeader,
  PageSection,
  SectionDivider,
  SearchBar,
  FilterRow,
  EmptyState,
  StaggerWrapper,
  FadeUpItem,
  LoadingState,
} from "@/components/AnimatedComponents";
import { KPI } from "@/components/ui/charts/components/KPI";

const opsFilter = [
  {
    id: "status_op",
    label: "Status",
    type: "checkbox",
    options: ["Aguardando", "Concluída", "Produzindo", "Parada", "Setup"],
  },
  {
    id: "prioridade",
    label: "Prioridade",
    type: "checkbox",
    options: ["Crítica", "Alta", "Média", "Baixa"],
  },
  { id: "progresso", label: "Progresso", type: "number-range" },
];

function contarOpsPorStatus(lista) {
  return (lista ?? []).reduce(
    (acc, op) => {
      const status = op.status_op;

      if (status === "Concluída") {
        acc.concluidas += 1;
      } else if (status === "Aguardando Início" || status === "Setup") {
        acc.aguardando += 1;
      } else if (["Produzindo", "Parada"].includes(status)) {
        acc.emAndamento += 1;
      }

      return acc;
    },
    { aguardando: 0, emAndamento: 0, concluidas: 0 },
  );
}

export default function OrdensDeProducao() {
  const pathname = usePathname();
  const [operadorId, setOperadorId] = useState(null);

  const colunasOrdemProd = [
    {
      id: "id",
      key: "id",
      label: "ID",
      className: "w-25 text-center justify-center",
    },
    {
      id: "prioridade",
      key: "prioridade",
      label: "Prioridade",
      className: "w-45",
      icone: (valor) => {
        const config = {
          "Média": {
            variant: "outline",
            className: "border border-[var(--azul-cobalto)]",
            icon: <MoveHorizontal className="text-azul-cobalto" />
          },
          "Alta": {
            variant: "secondary",
            className: "border border-[var(--amarelo)] bg-transparent",
            icon: <AlertTriangle className="text-amarelo" />
          },
          "Crítica": {
            variant: "destructive",
            className: "border border-[var(--vermelho-vivido)] bg-transparent text-black",
            icon: <Flame className="text-vermelho-vivido" />
          },
          "Baixa": {
            variant: "destructive",
            className: "border border-gray-400 text-sm bg-transparent text-black",
            icon: <ArrowDown className="text-gray-400" />
          }
        };


        const item = config[valor] || { icon: null };
        return (
          <Badge variant="outline" className={`whitespace-nowrap ${item.className} text-sm font-medium p-2.5`}>
            {item.icon}
            {valor}
          </Badge>
        );
      }
    },
    {
      id: "status_op",
      key: "status_op",
      label: 'Status',
      className: "text-center",
      icone: (valor) => {
        const config = {
          "Produzindo": {
            variant: "produzindo",
            label: "Produzindo"
          },
          "Setup": {
            variant: "setup",
            label: "Setup"
          },
          "Parada": {
            variant: "parada",
            label: "Parada"
          },
          "Concluída": {
            variant: "concluida",
            label: "Concluída"
          },
          "Aguardando": {
            variant: "aguardando",
            label: "Aguardando Início"
          }
        };

        const item = config[valor] || {
          variant: "default",
          label: valor
        };

        return (
          <Badge variant={item.variant}>
            {item.label}
          </Badge>
        );
      }
    },
    {
      id: "progresso",
      key: "progresso",
      label: "Progresso",
      className: "text-center w-[130px] max-w-[130px]",
      icone: (valor) => <OPProgressoCell valor={valor} />,
    },
  ];

  const { ops, loading, error, refresh } = useOps();
  const [dados, setDados] = useState([]);
  const [busca, setBusca] = useState("");

  const resumoOps = useMemo(() => contarOpsPorStatus(ops), [ops]);

  useEffect(() => {
    const user = getUserFromToken();
    if (user?.id_usuario) setOperadorId(user.id_usuario);
  }, []);

  useEffect(() => {
    setDados(ops);
  }, [ops]);

  useEffect(() => {
    refresh();
  }, [pathname, refresh]);

  useEffect(() => {
    const aoVoltarParaPagina = () => {
      if (document.visibilityState === "visible") refresh();
    };
    document.addEventListener("visibilitychange", aoVoltarParaPagina);
    return () =>
      document.removeEventListener("visibilitychange", aoVoltarParaPagina);
  }, [refresh]);

  //lógica de ordenação
  const handleSort = (criterio) => {
    const dadosCopiados = [...dados];

    dadosCopiados.sort((a, b) => {
      if (criterio === "id_asc") return a.id - b.id;
      if (criterio === "id_desc") return b.id - a.id;
      if (criterio === "progresso_asc") return a.progresso - b.progresso;
      if (criterio === "progresso_desc") return b.progresso - a.progresso;
      return 0;
    });

    setDados(dadosCopiados);
  };

  const aplicarFiltros = (filtrosSelecionados) => {
    let dadosFiltrados = [...ops]; // usa o estado da API, não array estático

    //filtro por status
    if (
      filtrosSelecionados.status_op &&
      filtrosSelecionados.status_op.length > 0
    ) {
      dadosFiltrados = dadosFiltrados.filter((op) =>
        filtrosSelecionados.status_op.includes(op.status_op),
      );
    }

    //filtro por prioridade
    if (filtrosSelecionados.prioridade?.length) {
      dadosFiltrados = dadosFiltrados.filter((op) =>
        filtrosSelecionados.prioridade.includes(op.prioridade),
      );
    }

    dadosFiltrados = filtrarPorNumberRange(
      dadosFiltrados,
      "progresso",
      filtrosSelecionados.progresso,
    );

    setDados(dadosFiltrados);
  };

  const opcoesOrdenacao = [
    { label: "ID Crescente", value: "id_asc" },
    { label: "ID Decrescente", value: "id_desc" },
    { label: "Progresso Crescente", value: "progresso_asc" },
    { label: "Progresso Decrescente", value: "progresso_desc" },
  ];

  //filtra os dados atuais (filtrados e ordenados) pelo termo de busca
  const dadosExibidos = dados.filter((op) => {
    const termo = (busca || "").toLowerCase();

    const id = op?.id?.toString() || "";

    return id.includes(termo);
  });

  //tela de carregamento enquanto busca os dados da API
  if (loading) {
    return <LoadingState message="Sincronizando ordens de produção..." />;
  }

  return (
    <PageLayout>
      <PageHeader title="Ordens de Produção" />

      <StaggerWrapper className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 w-full items-stretch">

        {/* Aguardando Início */}
        <FadeUpItem className="col-span-1 bg-zinc-100 dark:bg-zinc-900 p-5 rounded-lg shadow-sm aspect-square flex flex-col transition-colors duration-200">
          <KPI
            title="Aguardando Início"
            value={resumoOps.aguardando}
            titleClass="text-zinc-600 dark:text-zinc-400 text-base lg:text-lg text-center"
          />
        </FadeUpItem>

        {/* Em Andamento */}
        <FadeUpItem className="col-span-1 bg-[#effff5] dark:bg-emerald-950/20 p-5 rounded-lg shadow-sm aspect-square flex flex-col transition-colors duration-200">
          <KPI
            title="Em Andamento"
            value={resumoOps.emAndamento}
            titleClass="text-[#369948] dark:text-emerald-400 text-base lg:text-lg text-center"
          />
        </FadeUpItem>

        {/* Concluídas */}
        <FadeUpItem className="col-span-1 bg-[#e8f0ff] dark:bg-blue-950/30 p-5 rounded-lg shadow-sm aspect-square flex flex-col transition-colors duration-200">
          <KPI
            title="Concluídas"
            value={resumoOps.concluidas}
            titleClass="text-[#00357a] dark:text-blue-400 text-base lg:text-lg text-center"
          />
        </FadeUpItem>

        {/* Widget de Meta de Produção */}
        <FadeUpItem className="col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-2 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 shadow-sm p-5 rounded-lg flex flex-col justify-center min-h-60 transition-colors duration-200">
          <MetaProducaoWidget operadorId={operadorId} />
        </FadeUpItem>

      </StaggerWrapper>

      <PageSection id="listagem_ops">
        <SectionDivider title="OPs" />

        <SearchBar
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Busque por id..."
        />

        <FilterRow
          count={dadosExibidos.length}
          className="mb-6"
          label="OPs"
          actions={
            <>
              <OrdenarDropdown
                label="Ordenar por"
                options={opcoesOrdenacao}
                onSortChange={handleSort}
              />
              <FilterDropdown
                filtersConfig={opsFilter}
                onApply={aplicarFiltros}
              />
            </>
          }
        />
        {/* Tabela */}
        {dadosExibidos.length > 0 ? (
          <TableListagens
            /* Dados e colunas a depender da página [no momento está estático definido em um json, posteriormente será um get]  */
            data={dadosExibidos}
            columns={colunasOrdemProd}
            acoesDropdown={(ordemProd) => (
              <>
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link href={`ordensDeProducao/${ordemProd.id}`}>
                    <EyeIcon className="mr-2 h-4 w-4" />
                    Ver Detalhes
                  </Link>
                </DropdownMenuItem>
              </>
            )}
          />
        ) : (
          <EmptyState
            title="Nenhum resultado encontrado"
            message="Ajuste seus filtros ou termo de busca."
          />
        )}
      </PageSection>
    </PageLayout>
  );
}
