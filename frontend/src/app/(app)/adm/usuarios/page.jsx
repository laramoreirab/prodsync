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

import FilterDropdown from "@/components/ui/FilterDropdown";
import OrdenarDropdown from "@/components/ui/OrdenarDropdown";

import { DropdownMenuGroup, DropdownMenuItem, DropdownMenu, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

import Link from 'next/link';

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
    id: 'setor',
    key: 'setor',
    label: 'Setor',
    className: 'w-2/9',
    icone: (valor) => setorLabel[String(valor)] || valor
  },
  { id: 'funcao', key: 'funcao', label: 'Função' },
  {
    id: 'turno',
    key: 'turno',
    label: 'Turno',
    icone: (valor) => turnoLabel[String(valor)] || valor
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
      if (criterio === 'turno') return String(a.turno).localeCompare(String(b.turno));
      if (criterio === 'funcao') return a.funcao.localeCompare(b.funcao);
      if (criterio === 'setor') return String(a.setor).localeCompare(String(b.setor));
      return 0;
    });

    setDados(dadosCopiados);
  };

  //recebendo os filtros do dropdown e atualizando a tabela
  const aplicarFiltros = (filtrosSelecionados) => {
    let dadosFiltrados = [...usuarios];

    // setor
    if (filtrosSelecionados.setor?.length > 0) {
      dadosFiltrados = dadosFiltrados.filter(user =>
        filtrosSelecionados.setor.includes(user.setor)
      );
    }

    // função
    if (filtrosSelecionados.funcao?.length > 0) {
      dadosFiltrados = dadosFiltrados.filter(user =>
        filtrosSelecionados.funcao.includes(user.funcao)
      );
    }

    // turno
    if (filtrosSelecionados.turno?.length > 0) {
      dadosFiltrados = dadosFiltrados.filter(user =>
        filtrosSelecionados.turno.includes(user.turno)
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
    <main className="min-h-screen bg-[url('/bg_app.svg')] bg-cover bg-fixed bg-center bg-no-repeat flex flex-col">

      <div className="px-8 py-3">
        <section className="graphs_cadastro">
          {/* Título da tela e do botão que leva ao modal de cadastro do usuário */}
          <div className="flex justify-between py-3">
            <div className="title_tela">
              <h1 className="underline decoration-secondary-foreground underline-offset-9 decoration-5 text-4xl font-semibold">
                Usuários
              </h1>
            </div>

            {/* Modal de Cadastrar Usuário */}
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
          </div>

          {/* Gráficos */}
        </section>

        {/* SEÇÃO 1: Charts */}
        <section className="py-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border rounded-xl p-4">
              <QtdUsuariosWidget />
            </div>
            <div className="border rounded-xl p-4">
              <QtdUsuariosPorSetorWidget />
            </div>
            <div className="border rounded-xl p-4">
              <TopOperadoresWidget />
            </div>
          </div>
        </section>

        {/* SEÇÃO 2: Charts */}
        <section className="py-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border rounded-xl p-6">
              <TempoSessaoWidget />
            </div>
            <div className="border rounded-xl p-4">
              <RotatividadeWidget />
            </div>
          </div>
        </section>

        {/* SEÇÃO 3: Charts */}
        <section className="py-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border rounded-xl p-4">
              <CumprimentoMetaSetorWidget />
            </div>
            <div className="border rounded-xl p-4">
              <ProducaoMediaSetorWidget />
            </div>
          </div>
        </section>

        {/* Listagem */}
        <section id="listagem_usuarios" >
          <div className="flex items-center py-4 gap-5">
            <h1 className="text-4xl w-[125] font-semibold">Listagem de Usuários</h1>
            <hr className="bg-black flex-1 h-1" />
          </div>

          {/* Busca */}
          <div className="flex searchbar">
            <div className="flex searchid items-center w-full p-1 justify-between rounded-md bg-[#EFEFEF]">
              <input
                type="search"
                className="p-2 w-full outline-none bg-transparent"
                placeholder="Busque por nome ou id..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
              />
              <button className="outline-none cursor-pointer mr-2"><Search /></button>
            </div>
          </div>

          {/* Linha de quantidade total de usuários e filtrar e ordenar funcional */}
          <div className="row_ord_fil_cont flex items-center justify-between mt-3">
            <p>{dadosExibidos.length} usuários encontrados</p>

            <div className="flex gap-4 items-center">
              <OrdenarDropdown
                label="Ordenar por"
                options={opcoesOrdenacao}
                onSortChange={handleSort}
              />
              <FilterDropdown
                filtersConfig={usuariosFilter}
                onApply={aplicarFiltros}
              />
            </div>
          </div>

          <div className="flex flex-col flex-1 items-center w-full mt-4">
            {dadosExibidos.length > 0 ? (
              <TableListagens
                data={dadosExibidos}
                columns={colunasUsuarios}
                acoesDropdown={(user) => (
                  <>
                    {/* link*/}
                    <DropdownMenuItem asChild className="cursor-pointer">
                      <Link href={user.funcao === "Gestor" ? `/adm/usuarios/gestor/${user.id}` : `/adm/usuarios/${user.id}`}>
                        <EyeIcon className="mr-2 h-10 w-10" />
                        Ver Detalhes
                      </Link>
                    </DropdownMenuItem>

                    {/* editar */}
                    <Dialog>
                      <DialogTrigger asChild>
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="cursor-pointer">
                          <Pencil className="mr-2 h-4 w-4 text-primary" />
                          Editar
                        </DropdownMenuItem>
                      </DialogTrigger>
                      <DialogContent className="rounded-lg top-0 left-0 right-0 translate-x-0 translate-y-0 w-full max-w-none max-h-screen overflow-y-auto">
                        <FormEdicaoUsuario usuarioId={user.id} onEdicaoSucesso={refresh} />
                      </DialogContent>
                    </Dialog>

                    {/* excluir */}
                    <Dialog>
                      <DialogTrigger asChild>
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="cursor-pointer">
                          <Trash2 className="mr-2 h-4 w-4 text-vermelho-vivido" />
                          Excluir
                        </DropdownMenuItem>
                      </DialogTrigger>
                      <DialogContent>
                        <FormExclusaoUsuario usuarioId={user.id} onExclusaoSucesso={refresh} />
                      </DialogContent>
                    </Dialog>
                  </>
                )}
              />
            ) : (
              //caso não encontre nada correspondente
              <div className="flex flex-col items-center justify-center text-gray-500">
                <Search className="w-12 h-12 mb-4 text-gray-300" />
                <h2 className="text-xl font-semibold">Nenhum usuário encontrado</h2>
                <p>Não encontramos nenhum resultado correpondente para busca ou filtro.</p>
              </div>
            )}
          </div>
        </section>
      </div>


    </main>
  );
}
