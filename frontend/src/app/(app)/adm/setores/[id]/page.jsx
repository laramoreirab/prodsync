"use client";
import Header from "@/components/ui/topbar";
import { SetorMaquinaStatusWidget } from "@/features/setores/SetorMaquinaStatusWidget";
import { SetorOEEMedioWidget } from "@/features/setores/SetorOEEMedioWidget";
import { SetorOEEEvolucaoWidget } from "@/features/setores/SetorOEEEvolucaoWidget";
import { SetorTopOperadoresWidget } from "@/features/setores/SetorTopOperadoresWidget";
import { SetorMotivosParadaWidget } from "@/features/setores/SetorMotivosParadaWidget";
import { SetorProducaoSemanalWidget } from "@/features/setores/SetorProducaoSemanalWidget";
import Link from "next/link";
import { ChevronDown, Pencil, Trash2, Plus, Search } from "lucide-react";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import FormExclusaoSetor from "@/components/ui/forms/setores/formExclusaoSetor";
import FormEdicaoSetor from "@/components/ui/forms/setores/formEdicaoSetor";
import FormCriacaoTurno from "@/components/ui/forms/setores/formCadastroTurnoSetor";
import FormCadastroMaquina from "@/components/ui/forms/maquinas/formCadastroMaquina";
import FormCadastroUsuario from "@/components/ui/forms/usuarios/formCadastroUsuario";
import { useState } from "react";
import OrdenarDropdown from "@/components/ui/OrdenarDropdown";
import FilterDropdown from "@/components/ui/FilterDropdown";


export default function SetorEspecificoPage({ params }) {
  const { id } = params;
  const [buscaMaquinas, setBuscaMaquinas] = useState("");
  const [buscaUsuarios, setBuscaUsuarios] = useState("");

  //opções de ordenação para máquinas e usuários
  const opcoesOrdenacaoMaquinas = [
    { label: 'ID Crescente', value: 'id_asc' },
    { label: 'ID Decrescente', value: 'id_desc' },
    { label: 'OEE Crescente', value: 'oee_asc' },
    { label: 'OEE Decrescente', value: 'oee_desc' },
    { label: 'Status', value: 'status' },
  ];

  const opcoesOrdenacaoUsers = [
    { label: 'Ordem Alfabética', value: 'nome_asc' },
    { label: 'ID Crescente', value: 'id_asc' },
    { label: 'ID Decrescente', value: 'id_desc' },
    { label: 'OEE Crescente', value: 'oee_asc' },
    { label: 'OEE Decrescente', value: 'oee_desc' },
    { label: 'Status', value: 'status' },
    { label: 'Turno', value: 'turno' },
    { label: 'Função', value: 'funcao' }
  ];

  //filtros para máquinas e usuários
  const maquinasFilter = [
    { id: "status", label: "Tipo", type: "checkbox", options: ["Parada", "Setup", "Produzindo", "Parada Justificada", "Parada Não Justificada"] },
    { id: "data", label: "Data", type: "date-range" },
    { id: "oee", label: "OEE Médio", type: "number-range" },
  ];

  const usuariosFilter = [
    { id: "funcao", label: "Função", type: "checkbox", options: ["Operador", "Gestor"] },
    { id: "turno", label: "Turno", type: "checkbox", options: ["Manhã", "Tarde", "Noite"] },
    { id: "oee", label: "OEE Médio", type: "number-range" },
  ]

  // funções para ordenação e aplicação de filtros 
  // ainda precisam ser implementadas! no momento que elas foram feitas, não havia tabelas ainda
  const handleSortMaquinas = (criterio) => {
    console.log("Ordenar máquinas por:", criterio);
    //lógica de ordenação aqui
  };
  const handleSortUsuarios = (criterio) => {
    console.log("Ordenar usuários por:", criterio);
    //lógica de ordenação aqui
  }

  const aplicarFiltrosMaquinas = (filtrosSelecionados) => {
    console.log("Aplicar filtros nas máquinas:", filtrosSelecionados);
    // lógica de aplicação de filtros aqui
  }

  const aplicarFiltrosUsers = (filtrosSelecionados) => {
    console.log("Aplicar filtros nos usuários:", filtrosSelecionados);
    //lógica de aplicação de filtros aqui
  }

  return (
    <main
      className="relative min-h-screen w-full flex flex-col items-center overflow-x-hidden"
      style={{
        backgroundImage: "url('/bg_app.svg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="w-full">
        <Header />
      </div>


      {/* Infos do Setor */}
      <div className="w-full mt-8 px-8 space-y-4">

        <Link className="flex items-center" href="/adm/setores">
          <ChevronDown className="mr-1 text-gray-500 inline-block transform -rotate-270" />
          <p className="text-xl font-semibold text-gray-800">Voltar para Setores</p>
        </Link>

        <section id="infos_setor" className="flex flex-col">
          <div className="flex justify-between items-center">
            <h1 className="text-4xl font-bold">Setor: Engrenagens</h1>

            <div className="flex space-x-2">
              <Dialog>
                <DialogTrigger className="text-[#122f60] cursor-pointer">
                  <Pencil size={36} className="mr-1" />
                </DialogTrigger>
                <DialogContent>
                  <FormEdicaoSetor />
                </DialogContent>
              </Dialog>

              <Dialog>
                <DialogTrigger className="text-[#b30000] cursor-pointer">
                  <Trash2 className=" w-9 h-9" />
                </DialogTrigger>
                <DialogContent>
                  <FormExclusaoSetor />
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <div className="py-3 font-medium text-gray-900 text-xl">
            <div className="flex flex-col gap-1">
              <p>Gestor Responsável:
                <Link href="/adm/operadores/1" className="hover:underline ml-2">
                  João Silva
                </Link>
              </p>
              <div className="flex">
                <p>Turnos:</p>
                <ul className="list-disc list-inside ml-4">
                  <li>Manhã (Segunda a Sexta): 06:00 - 14:00</li>
                  <li>Tarde (Segunda a Sexta): 14:00 - 22:00</li>
                  <li>Noite (Segunda a Sexta): 22:00 - 06:00</li>
                </ul>
              </div>
              <p>Localização: Galpão Sul - Bloco A</p>
            </div>
          </div>
        </section>

        <div className="flex justify-end">
          <Dialog>
            <DialogTrigger className="cursor-pointer bg-blue-900 flex items-center px-4 py-2 rounded-md text-white font-semibold text-2xl gap-2">
              <Plus size={24} className="text-white " />
              Criar Turno
            </DialogTrigger>
            <DialogContent>
              <FormCriacaoTurno />
            </DialogContent>
          </Dialog>
        </div>

        {/* Seção de Gráficos */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 bg-white border rounded-xl p-6 shadow-sm">
            <SetorMaquinaStatusWidget setorId={id} />
          </div>
          <div className="md:col-span-1 bg-white border rounded-xl p-6 shadow-sm flex flex-col items-center justify-center">
            <SetorOEEMedioWidget setorId={id} />
          </div>
        </section>


        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 bg-white border rounded-xl p-6 shadow-sm">
            <SetorProducaoSemanalWidget setorId={id} />
          </div>
          <div className="md:col-span-1 bg-white border rounded-xl p-6 shadow-sm">
            <SetorTopOperadoresWidget setorId={id} />
          </div>
        </section>


        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-1 bg-white border rounded-xl p-6 shadow-sm">
            <SetorMotivosParadaWidget setorId={id} />
          </div>
          <div className="md:col-span-2 bg-white border rounded-xl p-6 shadow-sm">
            <SetorOEEEvolucaoWidget setorId={id} />
          </div>
        </section>

        {/* LISTAGENS */}
        {/* Listagem de Máquinas */}
        <section id="listagem_maquinas" className="flex flex-col gap-4">

          <div className="flex items-center justify-between gap-5">
            <h1 className="text-4xl w-[125] font-semibold">
              Inventário de Máquinas do Setor
            </h1>

            <Dialog>
              <DialogTrigger className="cursor-pointer bg-blue-900 flex items-center px-4 py-2 rounded-md text-white font-semibold text-2xl gap-2">
                <Plus size={28} />
                Cadastrar
              </DialogTrigger>

              <DialogContent>
                <FormCadastroMaquina />
              </DialogContent>
            </Dialog>
          </div>

          <div className="flex searchbar">
            <div className="flex searchid items-center w-full p-1 justify-between rounded-md bg-[#EFEFEF]">
              <input
                type="search"
                className="p-2 w-full outline-none bg-transparent"
                placeholder="Busque por nome ou id..."
                value={buscaMaquinas}
                onChange={(e) => setBuscaMaquinas(e.target.value)}
              />
              <button className="mr-2">
                <Search />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between w-full mt-3">
            <p>máquinas encontradas</p>

            <div className="flex items-center gap-4">
              <OrdenarDropdown
                label="Ordenar por"
                options={opcoesOrdenacaoMaquinas}
                onSortChange={handleSortMaquinas}
              />

              <FilterDropdown
                filtersConfig={maquinasFilter}
                onApply={aplicarFiltrosMaquinas}
              />
            </div>
          </div>

        </section>

        {/* Listagem Usuários */}
        <section id="listagem_usuarios" className="flex flex-col gap-4">

          <div className="flex items-center justify-between gap-5">
            <h1 className="text-4xl w-[125] font-semibold">
              Listagem de Usuários do Setor
            </h1>

            <Dialog>
              <DialogTrigger className="cursor-pointer bg-blue-900 flex items-center px-4 py-2 rounded-md text-white font-semibold text-2xl gap-2">
                <Plus size={28} />
                Cadastrar
              </DialogTrigger>

              <DialogContent>
                <FormCadastroUsuario />
              </DialogContent>
            </Dialog>
          </div>

          <div className="flex searchbar">
            <div className="flex searchid items-center w-full p-1 justify-between rounded-md bg-[#EFEFEF]">
              <input
                type="search"
                className="p-2 w-full outline-none bg-transparent"
                placeholder="Busque por nome ou id..."
                value={buscaUsuarios}
                onChange={(e) => setBuscaUsuarios(e.target.value)}
              />
              <button className="mr-2">
                <Search />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between w-full mt-3">
            <p>usuários encontrados</p>

            <div className="flex items-center gap-4">
              <OrdenarDropdown
                label="Ordenar por"
                options={opcoesOrdenacaoUsers}
                onSortChange={handleSortUsuarios}
              />

              <FilterDropdown
                filtersConfig={usuariosFilter}
                onApply={aplicarFiltrosUsers}
              />
            </div>
          </div>



        </section>
      </div>
    </main>
  );
}