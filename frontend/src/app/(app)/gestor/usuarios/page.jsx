"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { EyeIcon, Loader2, Pencil, Plus, Search, Trash2 } from "lucide-react";

import TableListagens from "@/components/table";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import FilterDropdown from "@/components/ui/FilterDropdown";
import OrdenarDropdown from "@/components/ui/OrdenarDropdown";
import FormCadastroOperadorGestor from "@/components/ui/forms/usuarios/formCadastroOperadorGestor";
import FormEdicaoOperadorGestor from "@/components/ui/forms/usuarios/formEdicaoOperadorGestor";
import FormExclusaoUsuario from "@/components/ui/forms/usuarios/formExclusaoUsuario";
import { useUsuarios } from "@/hooks/useUsuarios";
import { usePerfil } from "@/hooks/usePerfil";
import { QtdUsuariosWidget } from "@/features/usuarios/QtdUsuariosWidget";
import { TurnosOperadoresWidget } from "@/features/usuarios/TurnosOperadoresWidget";
import { TopOperadoresWidget } from "@/features/usuarios/TopOperadoresWidget";
import { TempoSessaoWidget } from "@/features/usuarios/TempoSessaoWidget";
import { RotatividadeWidget } from "@/features/usuarios/RotatividadeWidget";
import { ProducaoMediaUsuarioSetorWidget } from "@/features/usuarios/ProducaoMediaUsuarioSetorWidget";
import { UsuarioTaxaRefugoWidget } from "@/features/usuarios/UsuarioTaxaRefugoWidget";

// Layout geral
import { PageLayout, PageHeader, SectionDivider, FadeUpItem, SearchBar, FilterRow, EmptyState, KPIGrid, WidgetCard, ContentGrid } from "@/components/AnimatedComponents";

// Componentes de detalhe
import {
  DetailPageContainer,
  DetailBackLink,
  UserProfileCard,
  DetailSectionTitle,
  DetailWidgetGrid,
  DetailWidgetCard,
  SectionHighlight,
  DetailListingSection,
  DetailActions,
} from "@/components/DetailComponents";

const turnoLabel = { 1: "Manhã", 2: "Tarde", 3: "Noite" };

const colunasUsuarios = [
  { id: "nome", key: "nome", label: "Nome", className: "w-1/5" },
  { id: "id", key: "id", label: "ID", className: "w-40" },
  { id: "maquina", key: "maquina", label: "Maquina", className: "pl-15" },
  {
    id: "id_turno",
    key: "id_turno",
    label: "Turno",
    icone: (valor) => turnoLabel[String(valor)] || valor || "-",
  },
];

function normalizarOperador(usuario) {
  return {
    ...usuario,
    maquina: usuario.maquina?.nome || usuario.maquina || "Sem maquina",
  };
}

export default function UsuariosGestor() {
  const { usuarios, loading, refresh } = useUsuarios();
  const { setorId } = usePerfil();
  const [dados, setDados] = useState([]);
  const [busca, setBusca] = useState("");

  const operadoresDoSetor = useMemo(() => {
    return (usuarios || [])
      .filter((usuario) => {
        const mesmoSetor = !setorId || String(usuario.id_setor) === String(setorId);
        const funcao = usuario.funcao || usuario.tipo;
        return mesmoSetor && funcao === "Operador";
      })
      .map(normalizarOperador);
  }, [usuarios, setorId]);

  useEffect(() => {
    setDados(operadoresDoSetor);
  }, [operadoresDoSetor]);

  const handleSort = (criterio) => {
    const ordenado = [...dados].sort((a, b) => {
      if (criterio === "nome") return a.nome.localeCompare(b.nome);
      if (criterio === "id_asc") return Number(a.id) - Number(b.id);
      if (criterio === "id_desc") return Number(b.id) - Number(a.id);
      if (criterio === "turno") return String(a.id_turno || "").localeCompare(String(b.id_turno || ""));
      return 0;
    });
    setDados(ordenado);
  };

  const aplicarFiltros = (filtrosSelecionados) => {
    let filtrados = [...operadoresDoSetor];

    if (filtrosSelecionados.id_turno?.length > 0) {
      dadosFiltrados = dadosFiltrados.filter((user) =>
        filtrosSelecionados.id_turno.includes(turnoLabel[user.id_turno]),
      );
    }

    // filtro por oee
    if (filtrosSelecionados.oee_medio) {
      const { min, max } = filtrosSelecionados.oee_medio;
      const limiteMin = min !== "" && min !== undefined ? parseFloat(min) : 0;
      const limiteMax =
        max !== "" && max !== undefined ? parseFloat(max) : Infinity;

      dadosFiltrados = dadosFiltrados.filter((item) => {
        const valorNumerico = parseOEE(item.oee_medio);
        return valorNumerico >= limiteMin && valorNumerico <= limiteMax;
      });
    }

    setDados(dadosFiltrados);
  };

  //filtra os dados atuais (filtrados e ordenados) pelo termo de busca
  const dadosExibidos = dados.filter((user) => {
    const termo = busca.toLowerCase();
    return user.nome?.toLowerCase().includes(termo) || String(user.id).includes(termo);
  });

  if (loading) {
    return (
      <main className="min-h-screen bg-[url('/bg_app.svg')] bg-cover bg-fixed bg-center bg-no-repeat flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-blue-900" />
      </main>
    );
  }

  return (
    <PageLayout>
      <PageHeader
        title="Usuários"
        action={
          <Dialog>
            <DialogTrigger className="bg-secondary-foreground px-4 py-1 rounded-md flex items-center text-white text-xl font-semibold cursor-pointer">
              <Plus className="mr-2" />
              Cadastrar
            </DialogTrigger>

            <DialogContent>
              <FormCadastroOperadorGestor /*onCadastroSucesso={refresh} */ />
            </DialogContent>
          </Dialog>
        }
      />

      {/* Gráficos */}
      <KPIGrid cols={3} className="mt-4">
        <WidgetCard>
          <QtdUsuariosWidget />
        </WidgetCard>

        <WidgetCard>
          <TurnosOperadoresWidget setorId={setorId} />
        </WidgetCard>

        <WidgetCard>
          <TopOperadoresWidget  setorId={setorId}/>
        </WidgetCard>
      </KPIGrid>

      <ContentGrid cols={2} className="mt-6">
        <WidgetCard>
          <TempoSessaoWidget setorId={setorId} />
        </WidgetCard>
        <WidgetCard>
           <RotatividadeWidget setorId={setorId} />
        </WidgetCard>
      </ContentGrid>

      <ContentGrid cols={2} className="mt-6">
        <WidgetCard>
          <ProducaoMediaUsuarioSetorWidget setorId={setorId} />
        </WidgetCard>
        <WidgetCard>
          <UsuarioTaxaRefugoWidget setorId={setorId} />
        </WidgetCard>
      </ContentGrid>

      {/* Listagem */}
      <SectionDivider title="Listagem de operadores" className="mt-8" />

      {/* Busca */}
      <SearchBar
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
        placeholder="Busque por nome ou id..."
      />

      {/* Ordenar e Filtrar */}

      <FilterRow
        count={dadosExibidos.length}
        label="usuários"
        actions={
          <>
            <OrdenarDropdown
              label="Ordenar por"
              options={opcoesOrdenacao}
              onSortChange={handleSort}
            />
            <FilterDropdown
              filtersConfig={usuariosFilter}
              onApply={aplicarFiltros}
            />
          </>
        }
      />

      {/* Tabela */}
      <FadeUpItem className="mt-4">
        {dadosExibidos.length > 0 ? (
          <TableListagens
            data={dadosExibidos}
            columns={colunasUsuarios}
            acoesDropdown={(user) => (
              <>
                {/* link*/}
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link href={`usuarios/${user.id}`}>
                    <EyeIcon className="mr-2 h-10 w-10" />
                    Ver Detalhes
                  </Link>
                </DropdownMenuItem>

                {/* editar */}
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
                  <DialogContent className="rounded-lg top-0 left-0 right-0 translate-x-0 translate-y-0 w-full max-w-none max-h-screen overflow-y-auto">
                    <FormEdicaoOperadorGestor
                      operadorId={user.id} /* onEdicaoSucesso={refresh}*/
                    />
                  </DialogContent>
                </Dialog>

                {/* excluir */}
                <Dialog>
                  <DialogTrigger asChild>
                    <DropdownMenuItem
                      onSelect={(e) => e.preventDefault()}
                      className="cursor-pointer"
                    >
                      <Trash2 className="mr-2 h-4 w-4 text-vermelho-vivido" />
                      Excluir
                    </DropdownMenuItem>
                  </DialogTrigger>
                  <DialogContent>
                    <FormExclusaoUsuario />
                  </DialogContent>
                </Dialog>
              </>
            )}
          />
        ) : (
          //caso não encontre nada correspondente
          <EmptyState
            title="Nenhum operador encontrado"
            message={`Não encontramos nenhum resultado para "${busca}".`}
          />
        )}
      </FadeUpItem>
    </PageLayout>
  );
}
