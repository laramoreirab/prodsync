"use client"

import Header from "@/components/ui/topbar";
import TableListagens from "@/components/table";
import React, { useState } from 'react';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus, Search } from "lucide-react";
import { Separator } from "@/components/ui/separator";

import FilterDropdown from "@/components/ui/filterDropdown";
import OrdenarDropdown from "@/components/ui/ordenarDropdown";

const usuariosFilter = [
  { id: "setor", label: "Setor", type: "checkbox", options: ["Brocas", "Roscas"] },
  { id: "funcao", label: "Função", type: "checkbox", options: ["Operador", "Gestor"] },
  { id: "turno", label: "Turno", type: "checkbox", options: ["Manhã", "Tarde", "Noite"] },
];

//dados dos usuarios
const dadosOriginais = [
  { id: 1, nome: 'Ana Silva', setor: 'Roscas', funcao: 'Operador', turno: 'Manhã' },
  { id: 2, nome: 'Carlos Souza', setor: 'Brocas', funcao: 'Gestor', turno: 'Tarde' },
  { id: 3, nome: 'Bruno Costa', setor: 'Roscas', funcao: 'Operador', turno: 'Noite' },
  { id: 4, nome: 'Bia Gonçalves', setor: 'Brocas', funcao: 'Gestor', turno: 'Tarde' }
];

export default function Usuarios() {
  const [dados, setDados] = useState(dadosOriginais);
  const [busca, setBusca] = useState("");

  //lógica de ordenação
  const handleSort = (criterio) => {
    const dadosCopiados = [...dados];

    dadosCopiados.sort((a, b) => {
      if (criterio === 'nome') return a.nome.localeCompare(b.nome);
      if (criterio === 'id_asc') return a.id - b.id;
      if (criterio === 'id_desc') return b.id - a.id;
      if (criterio === 'turno') return a.turno.localeCompare(b.turno);
      if (criterio === 'funcao') return a.funcao.localeCompare(b.funcao);
      if (criterio === 'setor') return a.setor.localeCompare(b.setor);
      return 0;
    });

    setDados(dadosCopiados);
  };

  //recebendo os filtros do dropdown e atualizando a tabela
  const aplicarFiltros = (filtrosSelecionados) => {
    let dadosFiltrados = [...dadosOriginais];

    //filtros para setor
    if (filtrosSelecionados.setor && filtrosSelecionados.setor.length > 0) {
      dadosFiltrados = dadosFiltrados.filter(user =>
        filtrosSelecionados.setor.includes(user.setor)
      );
    }

    //filtro para funçao do user
    if (filtrosSelecionados.funcao && filtrosSelecionados.funcao.length > 0) {
      dadosFiltrados = dadosFiltrados.filter(user =>
        filtrosSelecionados.funcao.includes(user.funcao)
      );
    }

    //filtro para turno
    if (filtrosSelecionados.turno && filtrosSelecionados.turno.length > 0) {
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

  const colunasUsuarios = [
    { key: 'nome', label: 'Nome' },
    { key: 'id', label: 'ID', className: 'w-20' },
    { key: 'setor', label: 'Setor' },
    { key: 'funcao', label: 'Função' },
    { key: 'turno', label: 'Turno' },
  ];

  //filtra os dados atuais (filtrados e ordenados) pelo termo de busca
  const dadosExibidos = dados.filter((user) => {
    const termo = busca.toLowerCase();
    return (
      user.nome.toLowerCase().includes(termo) ||
      user.id.toString().includes(termo)
    );
  });

  return (
    <main className="min-h-screen bg-[url('/bg_app.svg')] bg-cover bg-center bg-no-repeat  flex flex-col">
      <Header />

      <section className="graphs_cadastro">
        {/* Título da tela e do botão que leva ao modal de cadastro do usuário */}
        <div className="flex justify-between p-8">
          <div className="title_tela">
            <h1 className="underline decoration-secondary-foreground underline-offset-9 decoration-5 text-4xl font-semibold">
              Usuários
            </h1>
          </div>

          {/* Modal de Cadastrar Usuário*/}
          <Dialog>
            <DialogTrigger className="bg-secondary-foreground px-4 py-1 rounded-md flex items-center text-white text-xl font-semibold cursor-pointer">
              <Plus className="mr-2" />
              Cadastrar
            </DialogTrigger>

            <DialogContent className="top-0 left-0 right-0 translate-x-0 translate-y-0 w-full max-w-none rounded-b-lg">
              <div className=" title_modal flex items-center">
                <Plus className="mr-2" />
                <DialogTitle className="text-2xl">Cadastrar Usuário</DialogTitle>
              </div>
              <Separator className="m-2 bg-[#a6a6a6]" />
            </DialogContent>
          </Dialog>

        </div>

      </section>

      {/* Listagem */}
      <section id="listagem_usuarios">
        <div className="flex items-center p-8 gap-5">
          <h1 className="text-4xl w-[500px] font-semibold">Listagem de Usuários</h1>
          <hr className="bg-black flex-1 h-1" />
        </div>

        {/* Busca */}
        <div className="flex px-8 searchbar">
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

        {/* Linha de quantidade total de usuarios e filtrar e ordenar funcional */}
        <div className="row_ord_fil_cont flex items-center justify-between px-8 mt-3">
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
              /* Dados e colunas a depender da página [no momento está estático definido em um json, posteriormente será um get]  */
              data={dadosExibidos} columns={colunasUsuarios}

              // 1. Para a ação "ver detalhes" Url com base na linha clicada
              viewLink={(row) => `adm/usuarios/${row.id}`}

              // 2.  modais de Editar e Excluir para a tabela renderizar
              dialogs={{
                edit: (row) => (
                  <DialogContent className="rounded-lg">
                    <DialogTitle>Editar Usuário </DialogTitle> {/* Faz seu nome Gi, não estiizei nada */}
                    <Separator className="my-2" />

                    {/* Formulário do Modal aqui Gi, pode ser estatico ou um componente (sou apaixonada) rs */}
                    {/* colocar {row.nome} e assim por diante no placehoder pra saber o que está sendo editado */}

                  </DialogContent>
                ),
                delete: (row) => (
                  <DialogContent>
                    <DialogTitle className="text-red-600">Excluir Usuário</DialogTitle>

                      {/*  Importante usar o row.id aqui para saber qual linha está sendo deletava (talvez seja interessante usar row.nome para saber 
                      qual está sendo o usuário deletado [mas isso não ta no desing])
                  
                      <Button
                        onClick={() => deletar(row.id)} APENAS EXEMPLO, não existe o onCLick ainda
                      >
                        Deletar
                      </Button> */}

                  </DialogContent>
                )
              }}
            />
          ) : (
            //caso não encontre nada correspondente
            <div className="flex flex-col items-center justify-center p-8 text-gray-500">
              <Search className="w-12 h-12 mb-4 text-gray-300" />
              <h2 className="text-xl font-semibold">Nenhum usuário encontrado</h2>
              <p>Não encontramos nenhum resultado para "{busca}".</p>
            </div>
          )}
        </div>

      </section>
    </main>
  );
}