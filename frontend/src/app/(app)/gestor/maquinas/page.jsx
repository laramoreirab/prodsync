"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { EyeIcon, Loader2, Pencil, Plus, Search, Trash2 } from "lucide-react";

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
  { id: "nome", key: "nome", label: "Nome", className: "w-1/8" },
  { id: "id_maquina", key: "id_maquina", label: "ID", className: "w-30 text-center justify-center" },
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
        <Badge variant={estilo.variant} className={`whitespace-nowrap ${estilo.className}`}>
          {valor || "-"}
        </Badge>
      );
    },
  },
  { id: "oee_atual", key: "oee_atual", label: "OEE Atual", className: "w-45" },
  { id: "operador", key: "operador", label: "Operador", className: "w-1/7" },
];

const maquinasFilter = [
  { id: "status", label: "Status", type: "checkbox", options: ["Produzindo", "Setup", "Parada", "Manutencao", "Aguardando"] },
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
  const { setorId } = usePerfil();
  const { maquinas, loading, refresh, excluirMaquina } = useMaquinas();
  const [busca, setBusca] = useState("");
  const [dados, setDados] = useState([]);

  const maquinasDoSetor = useMemo(() => {
    return (maquinas || [])
      .filter((maquina) => !setorId || String(maquina.id_setor) === String(setorId))
      .map(normalizarMaquina);
  }, [maquinas, setorId]);

  useEffect(() => {
    setDados(maquinasDoSetor);
  }, [maquinasDoSetor]);

  const handleSort = (criterio) => {
    const ordenado = [...dados].sort((a, b) => {
      if (criterio === "nome") return a.nome.localeCompare(b.nome);
      if (criterio === "id_asc") return Number(a.id_maquina) - Number(b.id_maquina);
      if (criterio === "id_desc") return Number(b.id_maquina) - Number(a.id_maquina);
      if (criterio === "status") return String(a.status).localeCompare(String(b.status));
      return 0;
    });
    setDados(ordenado);
  };

  const aplicarFiltros = (filtrosSelecionados) => {
    let filtrados = [...maquinasDoSetor];
    if (filtrosSelecionados.status?.length > 0) {
      filtrados = filtrados.filter((maquina) => filtrosSelecionados.status.includes(maquina.status));
    }
    setDados(filtrados);
  };

  const dadosExibidos = dados.filter((maquina) => {
    const termo = busca.toLowerCase();
    return maquina.nome?.toLowerCase().includes(termo) || String(maquina.id_maquina).includes(termo);
  });

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="animate-spin text-blue-900 w-12 h-12" />
      </main>
    );
  }

  return (
    <PageLayout>
      <PageHeader title={`Máquinas do Setor ${setorId || 'Desconhecido'}`} action={
        <Dialog>
          <DialogTrigger className="bg-secondary-foreground px-4 py-1 rounded-md flex items-center text-white text-xl font-semibold cursor-pointer">
            <Plus className="mr-2" />
            Cadastrar
          </DialogTrigger>

          <FormCadastroMaquina onCadastroSucesso={refresh} />
        </Dialog>
      } />
      {/* Gráficos */}
      <KPIGrid cols={3} className="mt-4">

        <WidgetCard>
          <MaquinaStatusDonutWidget setorId={setorId} />
        </WidgetCard>

        <WidgetCard>
          <MaquinasPorSetorWidget setorId={setorId}/>
        </WidgetCard>

        <WidgetCard>
          <TempoMedioParadaWidget setorId={setorId}/>
        </WidgetCard>

      </KPIGrid>

      <ContentGrid cols={2} className="mt-6">
        <WidgetCard>
          <ProducaoDefeitosWidget setorId={setorId} />
        </WidgetCard>
        <WidgetCard>
          <MaquinasPorTurnoWidget />
        </WidgetCard>
      </ContentGrid>


      <FadeUpItem>
        <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
          <ProducaoTotalWidget />
        </div>
      </FadeUpItem>

      {/* LISTAGEM MAQUINAS */}
      <SectionDivider title="Listagem" className="mt-8" />

      {/* Busca */}
      <SearchBar
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
        placeholder="Busque por nome ou id..."
      />

      <FilterRow
        count={dadosExibidos.length}
        label="maquinas"
        actions={
          <>
            <OrdenarDropdown label="Ordenar por" options={opcoesOrdenacao} onSortChange={handleSort} />
            <FilterDropdown filtersConfig={aplicarFiltros} onApply={aplicarFiltros} />
          </>
        }
      />

      {/* Tabela */}
      <FadeUpItem className="mt-4">
        {dadosExibidos.length > 0 ? (

          <TableListagens
            /* Dados e colunas a depender da página [no momento está estático definido em um json, posteriormente será um get]  */
            data={dadosExibidos} columns={colunasMaquinas}
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
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="cursor-pointer">
                      <Pencil className="mr-2 h-4 w-4 text-primary" />
                      Editar
                    </DropdownMenuItem>
                  </DialogTrigger>
                  <DialogContent>
                    <FormEdicaoMaquina maquinaId={maquina.id_maquina} onEdicaoSucesso={refresh} />
                  </DialogContent>
                </Dialog>

                <Dialog>
                  <DialogTrigger asChild>
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="cursor-pointer">
                      <Trash2 className="mr-2 h-4 w-4 text-vermelho-vivido" />
                      Excluir
                    </DropdownMenuItem>
                  </DialogTrigger>
                  <DialogContent>
                    <FormExclusaoMaquina
                      maquinaId={maquina.id_maquina}
                      onExcluir={excluirMaquina}
                    />
                  </DialogContent>
                </Dialog>

              </>
            )}

          />
        ) : (
          //caso não encontre nada correspondente
          <EmptyState
            title="Nenhuma máquina encontrada"
            message={`Não encontramos nenhum resultado para "${busca}".`}
          />
        )}
      </FadeUpItem>

    </PageLayout >
  );
}
