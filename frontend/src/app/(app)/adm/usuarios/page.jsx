"use client"

import { useState, useEffect } from 'react';

import TableListagens from "@/components/table";
import { useUsuarios } from "@/hooks/useUsuarios";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus, Search, Info, File, Upload, ChevronDown, Trash2, TriangleAlert, EyeIcon, Pencil, Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";

import FilterDropdown from "@/components/ui/filterDropdown";
import OrdenarDropdown from "@/components/ui/ordenarDropdown";

import { DropdownMenuGroup, DropdownMenuItem, DropdownMenu, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

import Link from 'next/link';

import {
  PageLayout, PageHeader, SectionDivider,
  StaggerWrapper, FadeUpItem, AnimatedTitle,
  KPIGrid, ContentGrid, WidgetCard,
  SearchBar, FilterRow, EmptyState, LoadingState,
  PageSection,
} from "@/components/AnimatedComponents";

//filtros para dropdown de filtros da tabela de usuários
const usuariosFilter = [
  { id: "id_setor", label: "Setor", type: "checkbox", options: ["Roscas", "Brocas"] },
  { id: "funcao", label: "Função", type: "checkbox", options: ["Operador", "Gestor"] },
  { id: "id_turno", label: "Turno", type: "checkbox", options: ["Manhã", "Tarde", "Noite"] },
];

//Widgets dashboard
import { QtdUsuariosWidget } from "@/features/usuarios/QtdUsuariosWidget";
import { QtdUsuariosPorSetorWidget } from "@/features/usuarios/QtdUsuariosPorSetorWidget";
import { TopOperadoresWidget } from "@/features/usuarios/TopOperadoresWidget";
import { TempoSessaoWidget } from "@/features/usuarios/TempoSessaoWidget";
import { RotatividadeWidget } from "@/features/usuarios/RotatividadeWidget";
import { CumprimentoMetaSetorWidget } from "@/features/usuarios/CumprimentoMetaSetorWidget";
import { ProducaoMediaSetorWidget } from "@/features/usuarios/ProducaoMediaSetorWidget";
import FormCadastroUsuario from '@/components/ui/forms/usuarios/formCadastroUsuario';
import FormEdicaoUsuario from '@/components/ui/forms/usuarios/formEdicaoUsuario';
import FormExclusaoUsuario from '@/components/ui/forms/usuarios/formExclusaoUsuario';

const setorLabel = { "1": "Roscas", "2": "Brocas" };
const turnoLabel = { "1": "Manhã", "2": "Tarde", "3": "Noite" };

const colunasUsuarios = [
  { id: 'nome', key: 'nome', label: 'Nome', className: 'w-1/4' },
  { id: 'id', key: 'id', label: 'ID', className: 'w-40' },
  {
    id: 'id_setor',
    key: 'id_setor',
    label: 'Setor',
    className: 'w-2/9',
    icone: (valor) => setorLabel[valor] || valor
  },
  { id: 'funcao', key: 'funcao', label: 'Função' },
  {
    id: 'id_turno',
    key: 'id_turno',
    label: 'Turno',
    icone: (valor) => turnoLabel[valor] || valor
  },
];

export default function Usuarios() {
  const { usuarios, loading, error, refresh } = useUsuarios();
  const [dados, setDados] = useState([]);
  const [busca, setBusca] = useState("");


  //sincronizar dados da API com estado local
  useEffect(() => {
    setDados(usuarios || []);
  }, [usuarios]);

  //lógica de ordenação
  const handleSort = (criterio) => {
    const dadosCopiados = [...dados];

    dadosCopiados.sort((a, b) => {
      if (criterio === 'nome') return a.nome.localeCompare(b.nome);
      if (criterio === 'id_asc') return a.id - b.id;
      if (criterio === 'id_desc') return b.id - a.id;
      if (criterio === 'turno') return String(a.id_turno).localeCompare(String(b.id_turno));
      if (criterio === 'funcao') return a.funcao.localeCompare(b.funcao);
      if (criterio === 'setor') return String(a.id_setor).localeCompare(String(b.id_setor));
      return 0;
    });

    setDados(dadosCopiados);
  };

  //recebendo os filtros do dropdown e atualizando a tabela
  const aplicarFiltros = (filtrosSelecionados) => {
    let dadosFiltrados = [...usuarios];

    // setor
    if (filtrosSelecionados.id_setor?.length > 0) {
      dadosFiltrados = dadosFiltrados.filter(user =>
        filtrosSelecionados.id_setor.includes(setorLabel[user.id_setor])
      );
    }

    // função
    if (filtrosSelecionados.funcao?.length > 0) {
      dadosFiltrados = dadosFiltrados.filter(user =>
        filtrosSelecionados.funcao.includes(user.funcao)
      );
    }

    // turno
    if (filtrosSelecionados.id_turno?.length > 0) {
      dadosFiltrados = dadosFiltrados.filter(user =>
        filtrosSelecionados.id_turno.includes(turnoLabel[user.id_turno])
      );
    }

    setDados(dadosFiltrados);
  };

  const opcoesOrdenacao = [
    { label: 'Ordem Alfabética', value: 'nome' },
    { label: 'ID Crescente', value: 'id_asc' },
    { label: 'ID Decrescente', value: 'id_desc' },
    { label: 'Turno', value: 'turno' },
    { label: 'Função', value: 'funcao' },
    { label: 'Setor', value: 'setor' }
  ];

  //filtra os dados atuais (filtrados e ordenados) pelo termo de busca
  const dadosExibidos = dados.filter((user) => {
    const termo = busca.toLowerCase();

    return (
      user.nome?.toLowerCase().includes(termo) ||
      user.id?.toString().includes(termo)
    );
  });

  //tela de carregamento enquanto busca os dados da API
  if (loading) {
    return (
      <main className="min-h-screen bg-[url('/bg_app.svg')] bg-cover bg-fixed bg-center bg-no-repeat flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-900 mb-4" />
          <p className="text-lg text-gray-600 font-medium">Carregando usuários...</p>
        </div>
      </main>
    );
  }

  return (
    <PageLayout>
      <section className="graphs_cadastro">
        {/* Título da tela e do botão que leva ao modal de cadastro do usuário */}
        <PageHeader title="Usuários" action={
          <Dialog>
            <DialogTrigger
              className="bg-secondary-foreground px-4 py-1 rounded-md flex items-center text-white text-xl font-semibold cursor-pointer"
            >
              <Plus className="mr-2" />
              Cadastrar
            </DialogTrigger>

            <DialogContent className="top-0 left-0 right-0 translate-x-0 translate-y-0 w-full max-w-none rounded-b-lg max-h-screen overflow-y-auto">
              <FormCadastroUsuario onCadastroSucesso={refresh} />
            </DialogContent>
          </Dialog>
        } />

        {/* Gráficos */}
      </section>

      {/* SEÇÃO 1: Charts */}
      <KPIGrid cols={3} className="mt-4">

        <WidgetCard>
          <QtdUsuariosWidget />
        </WidgetCard>

        <WidgetCard>
          <QtdUsuariosPorSetorWidget />
        </WidgetCard>

        <WidgetCard>
          <TopOperadoresWidget />
        </WidgetCard>

      </KPIGrid>


      {/* Gráficos — 2 colunas */}
      <ContentGrid cols={2} className="mt-6">
        <WidgetCard>
          <TempoSessaoWidget />
        </WidgetCard>
        <WidgetCard>
          <RotatividadeWidget />
        </WidgetCard>
      </ContentGrid>

      <ContentGrid cols={2} className="mt-6">
        <WidgetCard>
          <CumprimentoMetaSetorWidget />
        </WidgetCard>
        <WidgetCard>
          <ProducaoMediaSetorWidget />
        </WidgetCard>
      </ContentGrid>

      {/* Listagem */}
      {/* Listagem de usuários */}
      <SectionDivider title="Listagem" className="mt-8" />

      <SearchBar
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
        placeholder="Busque por nome ou id..."
      />

      <FilterRow
        count={dadosExibidos.length}
        label="usuários"
        actions={
          <>
            <OrdenarDropdown label="Ordenar por" options={opcoesOrdenacao} onSortChange={handleSort} />
            <FilterDropdown filtersConfig={usuariosFilter} onApply={aplicarFiltros} />
          </>
        }
      />

      <FadeUpItem className="mt-4">
        {dadosExibidos.length > 0 ? (
          <div className="w-full overflow-x-auto">
          <TableListagens
            data={dadosExibidos}
            columns={colunasUsuarios}
            acoesDropdown={(user) => (
              <>
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link href={`usuarios/${user.id}`}>
                    <EyeIcon className="mr-2 h-4 w-4" /> Ver Detalhes
                  </Link>
                </DropdownMenuItem>

                <Dialog>
                  <DialogTrigger asChild>
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="cursor-pointer">
                      <Pencil className="mr-2 h-4 w-4 text-primary" /> Editar
                    </DropdownMenuItem>
                  </DialogTrigger>
                  <DialogContent className="top-0 left-0 right-0 translate-x-0 translate-y-0 w-full max-w-none rounded-b-lg max-h-screen overflow-y-auto">
                    <FormEdicaoUsuario usuarioId={user.id} onEdicaoSucesso={refresh} />
                  </DialogContent>
                </Dialog>

                <Dialog>
                  <DialogTrigger asChild>
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="cursor-pointer">
                      <Trash2 className="mr-2 h-4 w-4 text-vermelho-vivido" /> Excluir
                    </DropdownMenuItem>
                  </DialogTrigger>
                  <DialogContent>
                    <FormExclusaoUsuario usuarioId={user.id} onExclusaoSucesso={refresh} />
                  </DialogContent>
                </Dialog>
              </>
            )}
          />
          </div>
        ) : (
          <EmptyState
            title="Nenhum usuário encontrado"
            message={`Não encontramos nenhum resultado para "${busca}".`}
          />
        )}
      </FadeUpItem>

    </PageLayout>
  );
}