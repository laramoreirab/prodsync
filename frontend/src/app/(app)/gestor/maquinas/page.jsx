"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { EyeIcon, Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { ContentGrid, FadeUpItem, KPIGrid, PageHeader, PageLayout, SectionDivider, WidgetCard, LoadingState } from "@/components/AnimatedComponents";
import { FilterRow } from "@/components/AnimatedComponents";
import { EmptyState } from "@/components/AnimatedComponents";
import { SearchBar } from "@/components/AnimatedComponents";

import TableListagens from "@/components/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import FilterDropdown from "@/components/ui/FilterDropdown";
import OrdenarDropdown from "@/components/ui/OrdenarDropdown";
import FormCadastroMaquina from "@/components/ui/forms/maquinas/formCadastroMaquina";
import FormEdicaoMaquina from "@/components/ui/forms/maquinas/formEdicaoMaquina";
import FormExclusaoMaquina from "@/components/ui/forms/maquinas/formExclusaoMaquina";
import { useMaquinas } from "@/hooks/useMaquinas";
import { usePerfil } from "@/hooks/usePerfil";

import { MaquinaStatusDonutWidget } from "@/features/maquinas/MaquinaStatusDonutWidget";
import { MaquinasPorSetorWidget } from "@/features/maquinas/MaquinasPorSetorWidget";
import { TempoMedioParadaWidget } from "@/features/maquinas/TempoMedioParadaWidget";
import { ProducaoDefeitosWidget } from "@/features/maquinas/ProducaoDefeitosWidget";
import { MaquinasPorTurnoWidget } from "@/features/maquinas/MaquinasPorTurnoWidget";
import { ProducaoTotalWidget } from "@/features/maquinas/ProducaoTotalWidget";

const colunasMaquinas = [
  // Ajuste nas classes do Tailwind: w-1/8 -> w-[12.5%], w-30 -> w-32, w-45 -> w-48, w-1/7 -> w-[14%]
  { id: "nome", key: "nome", label: "Nome", className: "w-[12.5%]" },
  {
    id: "id_maquina",
    key: "id_maquina",
    label: "ID",
    className: "w-32 text-center justify-center",
  },
  {
    id: "status",
    key: "status",
    label: "Status",
    className: "text-center justify-center",
    icone: (valor) => {
      const config = {
        Produzindo: { variant: "produzindo" },
        Setup: { variant: "setup" },
        Parada: { variant: "parada" },
      };
      const estilo = config[valor] || { variant: "outline", className: "" };

      return (
        <Badge
          variant={estilo.variant}
          className={`whitespace-nowrap ${estilo.className}`}
        >
          {valor || "-"}
        </Badge>
      );
    },
  },
  { id: "oee_atual", key: "oee_atual", label: "OEE Atual", className: "w-48" },
  { id: "operador", key: "operador", label: "Operador", className: "w-[14%]" },
];

const maquinasFilter = [
  {
    id: "status",
    label: "Status",
    type: "checkbox",
    options: ["Produzindo", "Setup", "Parada", "Manutencao", "Aguardando"],
  },
];

const opcoesOrdenacao = [
  { label: "Ordem Alfabetica", value: "nome" },
  { label: "ID Crescente", value: "id_asc" },
  { label: "ID Decrescente", value: "id_desc" },
  { label: "Status", value: "status" },
];

function normalizarMaquina(maquina) {
  return {
    ...maquina,
    status: maquina.status_atual || maquina.status || "",
    operador: maquina.operador?.nome || maquina.operador || "Sem operador",
    oee_atual: maquina.oee_atual || "-",
  };
}

export default function MaquinasGestor() {
  const { setorId, setorNome } = usePerfil();
  const { maquinas, loading, refresh, excluirMaquina } = useMaquinas();

  // Estados declarativos apenas para os critérios
  const [busca, setBusca] = useState("");
  const [maquinaParaExcluir, setMaquinaParaExcluir] = useState(null);
  const [ordenacao, setOrdenacao] = useState("");
  const [filtrosAtivos, setFiltrosAtivos] = useState({});

  // 1. Memoiza apenas as máquinas tratadas e do setor correto
  const maquinasDoSetor = useMemo(() => {
    return (maquinas || [])
      .filter(
        (maquina) => !setorId || String(maquina.id_setor) === String(setorId),
      )
      .map(normalizarMaquina);
  }, [maquinas, setorId]);

  // 2. Aplica busca, filtro e ordenação automaticamente em cascata
  const dadosExibidos = useMemo(() => {
    let resultado = [...maquinasDoSetor];

    // Aplica a busca por texto
    if (busca) {
      const termo = busca.toLowerCase();
      resultado = resultado.filter((maquina) =>
        maquina.nome?.toLowerCase().includes(termo) ||
        String(maquina.id_maquina).includes(termo)
      );
    }

    // Aplica o filtro de status
    if (filtrosAtivos.status?.length > 0) {
      resultado = resultado.filter((maquina) =>
        filtrosAtivos.status.includes(maquina.status)
      );
    }

    // Aplica a ordenação
    if (ordenacao) {
      resultado.sort((a, b) => {
        if (ordenacao === "nome") return a.nome.localeCompare(b.nome);
        if (ordenacao === "id_asc")
          return Number(a.id_maquina) - Number(b.id_maquina);
        if (ordenacao === "id_desc")
          return Number(b.id_maquina) - Number(a.id_maquina);
        if (ordenacao === "status")
          return String(a.status).localeCompare(String(b.status));
        return 0;
      });
    }

    return resultado;
  }, [maquinasDoSetor, busca, filtrosAtivos, ordenacao]);

  if (loading) {
    return <LoadingState message="Carregando máquinas do setor..." />;
  }

  return (
    <PageLayout>
      <PageHeader
        title={`Máquinas do Setor ${setorNome || "Desconhecido"}`}
        action={
          <Dialog>
            <DialogTrigger className="bg-secondary-foreground px-4 py-1 rounded-md flex items-center text-white text-xl font-semibold cursor-pointer">
              <Plus className="mr-2" />
              Cadastrar
            </DialogTrigger>

            <DialogContent>
              <FormCadastroMaquina onCadastroSucesso={refresh} />
            </DialogContent>
          </Dialog>
        }
      />

      {/* Gráficos */}
      <KPIGrid cols={3} className="mt-4">
        <WidgetCard className="h-120">
          <MaquinaStatusDonutWidget setorId={setorId} />
        </WidgetCard>
        <WidgetCard>
          <MaquinasPorSetorWidget setorId={setorId} />
        </WidgetCard>
        <WidgetCard>
          <TempoMedioParadaWidget setorId={setorId} />
        </WidgetCard>
      </KPIGrid>

      <ContentGrid cols={2} className="mt-6">
        <WidgetCard>
          <ProducaoDefeitosWidget setorId={setorId} />
        </WidgetCard>
        <WidgetCard>
          <MaquinasPorTurnoWidget setorId={setorId} />
        </WidgetCard>
      </ContentGrid>

      <FadeUpItem className="mt-8">
        <div className="rounded-2xl bg-white p-8 shadow-sm border border-gray-100">
          <ProducaoTotalWidget setorId={setorId} />
        </div>
      </FadeUpItem>

      {/* LISTAGEM MAQUINAS */}
      <SectionDivider title="Inventário de Máquinas" className="mt-8" />

      <SearchBar
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
        placeholder="Busque por nome ou id..."
      />

      <FilterRow
        count={dadosExibidos.length}
        label="máquinas"
        actions={
          <>
            <OrdenarDropdown
              label="Ordenar por"
              options={opcoesOrdenacao}
              onSortChange={setOrdenacao}
            />
            {/* CORREÇÃO DO ERRO AQUI: Passando maquinasFilter no lugar da função */}
            <FilterDropdown
              filtersConfig={maquinasFilter}
              onApply={setFiltrosAtivos}
            />
          </>
        }
      />

      {/* Tabela */}
      <FadeUpItem className="mt-4">
        {dadosExibidos.length > 0 ? (
          <TableListagens
            data={dadosExibidos}
            columns={colunasMaquinas}
            acoesDropdown={(maquina) => (
              <>
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link href={`maquinas/${maquina.id_maquina}`}>
                    <EyeIcon className="mr-2 h-4 w-4" />
                    Ver Detalhes
                  </Link>
                </DropdownMenuItem>

                <Dialog>
                  <DialogTrigger asChild>
                    <DropdownMenuItem
                      onSelect={(e) => e.preventDefault()}
                      className="cursor-pointer"
                    >
                      <Pencil className="mr-2 h-4 w-4 text-primary" />
                      Editar
                    </DropdownMenuItem>
                  </DialogTrigger>
                  <DialogContent>
                    <FormEdicaoMaquina
                      maquinaId={maquina.id_maquina}
                      onEdicaoSucesso={refresh}
                    />
                  </DialogContent>
                </Dialog>

                <DropdownMenuItem
                  onSelect={(e) => {
                    e.preventDefault();
                    setMaquinaParaExcluir(maquina.id_maquina);
                  }}
                  className="cursor-pointer"
                >
                  <Trash2 className="mr-2 h-4 w-4 text-vermelho-vivido" />
                  Excluir
                </DropdownMenuItem>
              </>
            )}
          />
        ) : (
          <EmptyState
            title="Nenhuma máquina encontrada"
            message={`Não encontramos nenhum resultado para "${busca}".`}
          />
        )}
      </FadeUpItem>

      <Dialog
        open={maquinaParaExcluir != null}
        onOpenChange={(open) => {
          if (!open) setMaquinaParaExcluir(null);
        }}
      >
        <DialogContent>
          {maquinaParaExcluir != null && (
            <FormExclusaoMaquina
              key={maquinaParaExcluir}
              maquinaId={maquinaParaExcluir}
              onExcluir={excluirMaquina}
              onExclusaoSucesso={() => setMaquinaParaExcluir(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
}
