"use client";

import { useState } from "react";
import Link from "next/link";

import { EyeIcon, Pencil, Trash2, Search, Plus, Loader2 } from "lucide-react";

import { QtdUsuariosWidget } from "@/features/usuarios/QtdUsuariosWidget";
import { QtdUsuariosPorSetorWidget } from "@/features/usuarios/QtdUsuariosPorSetorWidget";
import { TopOperadoresWidget } from "@/features/usuarios/TopOperadoresWidget";
import { TempoSessaoWidget } from "@/features/usuarios/TempoSessaoWidget";
import { RotatividadeWidget } from "@/features/usuarios/RotatividadeWidget";
import { CumprimentoMetaSetorWidget } from "@/features/usuarios/CumprimentoMetaSetorWidget";
import { ProducaoMediaSetorWidget } from "@/features/usuarios/ProducaoMediaSetorWidget";

import TableListagens from "@/components/table";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import FilterDropdown from "@/components/ui/FilterDropdown";
import OrdenarDropdown from "@/components/ui/OrdenarDropdown";
import FormExclusaoUsuario from "@/components/ui/forms/usuarios/formExclusaoUsuario";
import FormCadastroOperadorGestor from "@/components/ui/forms/usuarios/formCadastroOperadorGestor";
import FormEdicaoOperadorGestor from "@/components/ui/forms/usuarios/formEdicaoOperadorGestor";


import { useEffect, useState } from "react";
import { QtdUsuariosWidget } from "@/features/usuarios/QtdUsuariosWidget";
import { TurnosOperadoresWidget } from "@/features/usuarios/TurnosOperadoresWidget";
import { TopOperadoresWidget } from "@/features/usuarios/TopOperadoresWidget";
import { TempoSessaoWidget } from "@/features/usuarios/TempoSessaoWidget";
import { RotatividadeWidget } from "@/features/usuarios/RotatividadeWidget";
import { ProducaoMediaUsuarioSetorWidget } from "@/features/usuarios/ProducaoMediaUsuarioSetorWidget";
import { UsuarioTaxaRefugoWidget } from "@/features/usuarios/UsuarioTaxaRefugoWidget";


const turnoLabel = { "1": "Manhã", "2": "Tarde", "3": "Noite" };

const colunasUsuarios = [
  { id: 'nome', key: 'nome', label: 'Nome', className: 'w-1/5' },
  { id: 'id', key: 'id', label: 'ID', className: 'w-40' },
  {
    id: 'oee_medio',
    key: 'oee_medio',
    label: 'OEE Médio',
    className: 'w-1/9 text-center',
  },
  { id: 'maquina', key: 'maquina', label: 'Máquina', className: 'pl-15' },
  {
    id: 'id_turno',
    key: 'id_turno',
    label: 'Turno',
    icone: (valor) => turnoLabel[valor] || valor
  },
];

export default function UsuariosGestor() {
  const dadosUsuarios = [
    {
      id: "001",
      nome: "Carlos Eduardo Silva",
      oee_medio: "88%",
      maquina: "Injetora HAITIAN 120",
      id_turno: 1
    },
    {
      id: "002",
      nome: "Ana Beatriz Oliveira",
      oee_medio: "92%",
      maquina: "Torno CNC Nardini",
      id_turno: 2
    },
    {
      id: "003",
      nome: "Marcos Paulo Souza",
      oee_medio: "75%",
      maquina: "Prensa Hidráulica 50T",
      id_turno: 3
    },
    {
      id: "004",
      nome: "Ricardo Dos Santos",
      oee_medio: "81%",
      maquina: "Fresadora Universal",
      id_turno: 1
    },
    {
      id: "005",
      nome: "Luciana Maria Costa",
      oee_medio: "95%",
      maquina: "Solda Robotizada Kuka",
      id_turno: 2
    },
    {
      id: "006",
      nome: "Lucas Lima Ferreira",
      oee_medio: "70%",
      maquina: "Corte a Laser Fiber",
      id_turno: 3
    },
    {
      id: "007",
      nome: "Beatriz Arantes",
      oee_medio: "84%",
      maquina: "Dobradeira CNC",
      id_turno: 1
    },
    {
      id: "008",
      nome: "João Pedro Pereira",
      oee_medio: "89%",
      maquina: "Extrusora de Perfil",
      id_turno: 2
    },
    {
      id: "009",
      nome: "Fernando Dias Rosa",
      oee_medio: "77%",
      maquina: "Retífica Plana",
      id_turno: 3
    },
    {
      id: "010",
      nome: "Mariana Gomes",
      oee_medio: "91%",
      maquina: "Torno Automático A25",
      id_turno: 1
    },
    {
      id: "011",
      nome: "Roberto Alves",
      oee_medio: "83%",
      maquina: "Centro de Usinagem VMC",
      id_turno: 2
    },
    {
      id: "012",
      nome: "Sérgio Murilo",
      oee_medio: "98%",
      maquina: "Compressor de Ar Atlas",
      id_turno: 3
    },
    {
      id: "013",
      nome: "Felipe Ramos",
      oee_medio: "65%",
      maquina: "Ponte Rolante 10T",
      id_turno: 1
    },
    {
      id: "014",
      nome: "Patrícia Melo",
      oee_medio: "80%",
      maquina: "Forno de Têmpera",
      id_turno: 2
    },
    {
      id: "015",
      nome: "Gabriel Torres",
      oee_medio: "87%",
      maquina: "Envasadora Automática",
      id_turno: 3
    }
  ];

  // const { usuarios, loading, error, refresh } = useUsuarios();
  const [dados, setDados] = useState(dadosUsuarios);
  const [busca, setBusca] = useState("");

  const opcoesOrdenacao = [
    { label: 'Ordem Alfabética', value: 'nome' },
    { label: 'ID Crescente', value: 'id_asc' },
    { label: 'ID Decrescente', value: 'id_desc' },
    { label: "OEE Crescente", value: "oee_asc" },
    { label: "OEE Decrescente", value: "oee_desc" },
  ];

  //lógica de ordenação
  const handleSort = (criterio) => {
    const dadosCopiados = [...dados];
    const parseOEE = (valor) => parseFloat(String(valor).replace("%", ""));

    dadosCopiados.sort((a, b) => {
      if (criterio === 'nome') return a.nome.localeCompare(b.nome);
      if (criterio === 'id_asc') return a.id - b.id;
      if (criterio === 'id_desc') return b.id - a.id;
      if (criterio === 'oee_asc') return parseOEE(a.oee_medio) - parseOEE(b.oee_medio);
      if (criterio === 'oee_desc') return parseOEE(b.oee_medio) - parseOEE(a.oee_medio);

      return 0;
    });

    setDados(dadosCopiados);
  };

  const usuariosFilter = [
    { id: "id_turno", label: "Turno", type: "checkbox", options: ["Manhã", "Tarde", "Noite"] },
    { id: "oee_medio", label: "OEE Médio", type: "number-range" }
  ];

  //recebendo os filtros do dropdown e atualizando a tabela
  const aplicarFiltros = (filtrosSelecionados) => {
    let dadosFiltrados = [...dadosUsuarios];
    const parseOEE = (valor) => parseFloat(String(valor).replace("%", ""));

    // filtro por turno
    if (filtrosSelecionados.id_turno?.length > 0) {
      dadosFiltrados = dadosFiltrados.filter(user =>
        filtrosSelecionados.id_turno.includes(turnoLabel[user.id_turno])
      );
    }

    // filtro por oee
    if (filtrosSelecionados.oee_medio) {
      const { min, max } = filtrosSelecionados.oee_medio;
      const limiteMin = min !== "" && min !== undefined ? parseFloat(min) : 0;
      const limiteMax = max !== "" && max !== undefined ? parseFloat(max) : Infinity;

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

    return (
      user.nome?.toLowerCase().includes(termo) ||
      user.id?.toString().includes(termo)
    );
  });

  return (
    <main className="min-h-screen bg-[url('/bg_app.svg')] bg-cover bg-fixed bg-center bg-no-repeat flex flex-col">
      <div className="px-8">

        <div className="py-4">
          <div className="flex justify-between items-center">
            <h1 className="underline decoration-secondary-foreground underline-offset-9 decoration-5 text-4xl font-semibold">
              Usuários
            </h1>
            <Dialog>
              <DialogTrigger className="bg-secondary-foreground px-4 py-1 rounded-md flex items-center text-white text-xl font-semibold cursor-pointer">
                <Plus className="mr-2" />
                Cadastrar
              </DialogTrigger>

              <DialogContent>
                 <FormCadastroOperadorGestor /*onCadastroSucesso={refresh} *//> 
              </DialogContent>
            </Dialog>
          </div>

        </div>

        {/* Gráficos */}
              <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm min-h-[300px]">
          <QtdUsuariosWidget />
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm min-h-[300px]">
          <TurnosOperadoresWidget setorId={setorId} />
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm min-h-[300px]">
          <TopOperadoresWidget setorId={setorId} />
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex items-center">
          <TempoSessaoWidget setorId={setorId} />
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <RotatividadeWidget setorId={setorId} />
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <ProducaoMediaUsuarioSetorWidget setorId={setorId} />
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <UsuarioTaxaRefugoWidget setorId={setorId} />
          </div>
          </section>


        {/* Listagem */}
        <section>
          <div className="flex items-center py-6 gap-5">
            <h1 className="text-4xl w-[125] font-semibold">Listagem de Operadores</h1>
            <hr className="bg-black flex-1 h-1" />
          </div>

          {/* Busca */}
          <div className="flex searchbar mt-4">
            <div className="flex searchid items-center w-full p-1 justify-between rounded-md bg-[#EFEFEF]">
              <input
                type="search"
                className="p-2 w-full font-medium outline-none bg-transparent"
                placeholder="Busque por nome ou id..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
              />
              <button className="outline-none cursor-pointer mr-2"><Search /></button>
            </div>
          </div>

          {/* Ordenar e Filtrar */}
          <div className="row_ord_fil_cont flex items-center justify-between mt-3">
            <p>{dadosExibidos.length} operadores encontrados </p>

            <div className="flex items-center gap-4">
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


          {/* Tabela */}
          <div className="flex flex-col flex-1 items-center w-full mt-4">
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
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="cursor-pointer">
                          <Pencil className="mr-2 h-4 w-4 text-primary" />
                          Editar
                        </DropdownMenuItem>
                      </DialogTrigger>
                      <DialogContent className="rounded-lg top-0 left-0 right-0 translate-x-0 translate-y-0 w-full max-w-none max-h-screen overflow-y-auto">
                       <FormEdicaoOperadorGestor operadorId={user.id}  /* onEdicaoSucesso={refresh}*/ /> 
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
                        <FormExclusaoUsuario />
                      </DialogContent>
                    </Dialog>
                  </>
                )}
              />) : (
              //caso não encontre nada correspondente
              <div className="flex flex-col items-center justify-center p-8 text-gray-500">
                <Search className="w-12 h-12 mb-4 text-gray-300" />
                <h2 className="text-xl font-semibold">Nenhum operador encontrado</h2>
                <p>Não encontramos nenhum operador com a busca ou filtro.</p>
              </div>
            )}
          </div>
        </section>

      </div>
    </main>
  );
}