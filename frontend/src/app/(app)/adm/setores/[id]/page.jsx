"use client"

import Header from "@/components/ui/topbar";
import { SetorMaquinaStatusWidget } from "@/features/setores/SetorMaquinaStatusWidget";
import { SetorOEEMedioWidget } from "@/features/setores/SetorOEEMedioWidget";
import { SetorOEEEvolucaoWidget } from "@/features/setores/SetorOEEEvolucaoWidget";
import { SetorTopOperadoresWidget } from "@/features/setores/SetorTopOperadoresWidget";
import { SetorMotivosParadaWidget } from "@/features/setores/SetorMotivosParadaWidget";
import { SetorProducaoSemanalWidget } from "@/features/setores/SetorProducaoSemanalWidget";
import { use, useState, useEffect } from "react";
import Link from "next/link";
import TableListagens from "@/components/table";
import { Badge } from "@/components/ui/badge";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { ChevronDown, Pencil, Trash2, Plus, Search, EyeIcon } from "lucide-react";
import FormExclusaoSetor from "@/components/ui/forms/setores/formExclusaoSetor";
import FormEdicaoSetor from "@/components/ui/forms/setores/formEdicaoSetor";
import FormCriacaoTurno from "@/components/ui/forms/setores/formCadastroTurnoSetor";
import FormCadastroMaquina from "@/components/ui/forms/maquinas/formCadastroMaquina";
import FormCadastroUsuario from "@/components/ui/forms/usuarios/formCadastroUsuario";
import OrdenarDropdown from "@/components/ui/OrdenarDropdown";
import FilterDropdown from "@/components/ui/FilterDropdown";
import turnoCrudService from "@/services/turnoCrudService";
import FormEdicaoMaquina from "@/components/ui/forms/maquinas/formEdicaoMaquina";
import FormExclusaoMaquina from "@/components/ui/forms/maquinas/formExclusaoMaquina";
import FormEdicaoUsuario from "@/components/ui/forms/usuarios/formEdicaoUsuario";
import FormExclusaoUsuario from "@/components/ui/forms/usuarios/formExclusaoUsuario";


const colunaUsuarioSetor = [
  { id: "nome", key: "nome", label: "Nome", className: "w-1/7" },
  { id: "id", key: "id", label: "ID", className: "w-1/5" },
  { id: "funcao", key: "funcao", label: "Função", className: "w-1/5" },
  { id: "turno", key: "turno", label: "Turno", className: "w-1/5" },
  {
    id: "oee_medio",
    key: "oee_medio",
    label: "OEE Médio",
    className: "w-45",
  }
];

const colunaMaquinaSetor = [
  { id: "nome", key: "nome", label: "Nome(ID)", className: "w-1/7" },
  { id: "oee_atual", key: "oee_atual", label: "OEE Atual", className: "w-45", },
  { id: "operador", key: "operador", label: "Operador", className: "w-1/5" },
  {
    id: 'status',
    key: 'status',
    label: 'Status',
    className: 'text-center justify-center',
    icone: (valor) => {
      const config = {
        "Produzindo": {
          variant: "outline",
          className: "bg-green-500/15 text-green-600 text-sm font-semibold border-none"
        },
        "Setup": {
          variant: "secondary",
          className: "bg-[#fffbea] text-amarelo font-semibold text-sm "
        },
        "Parada": {
          variant: "destructive",
          className: "font-semibold text-sm border-none"
        }
      };

      const estilo = config[valor] || { variant: "outline", className: "" };
      return (
        <Badge variant={estilo.variant} className={`whitespace-nowrap ${estilo.className}`}>
          {valor}
        </Badge>
      );
    }
  },
  { id: "ultima_parada", key: "ultima_parada", label: "Última Parada", className: "w-1/5" },
];

export default function SetorEspecificoPage({ params }) {
  const { id } = use(params);
  const [buscaMaquinas, setBuscaMaquinas] = useState("");
  const [buscaUsuarios, setBuscaUsuarios] = useState("");
  const [turnos, setTurnos] = useState([]);

  useEffect(() => {
    const carregarTurnos = async () => {
      try {
        const response = await turnoCrudService.getBySetor(id);
        if (response.sucesso) setTurnos(response.dados);
      } catch (error) {
        console.error("Erro ao carregar turnos:", error);
      }
    };
    carregarTurnos();
  }, [id]);

  const dadosExibidos = []; // TODO: Integrar listagem real de usuários do setor
  const dadosMaquina = [
    {
      nome: "Injetora 01",
      oee_atual: "88%",
      oee_medio: "82%",
      operador: "Luiz Gonçalves",
      status: "Produzindo",
      ultima_parada: "Hoje, 08:15",
    },
    {
      nome: "Torno CNC A2",
      oee_atual: "0%",
      oee_medio: "75%",
      operador: "Luiz Gonçalves",
      status: "Parada",
      ultima_parada: "Hoje, 10:30",
    },
    {
      nome: "Prensa Hidráulica",
      oee_atual: "92%",
      oee_medio: "89%",
      operador: "Luiz Gonçalves",
      status: "Produzindo",
      ultima_parada: "Ontem, 22:00",
    },
    {
      nome: "Fresa Industrial",
      oee_atual: "45%",
      oee_medio: "70%",
      operador: "Luiz Gonçalves",
      status: "Setup",
      ultima_parada: "Hoje, 07:00",
    },
    {
      nome: "Solda Robótica 05",
      oee_atual: "98%",
      oee_medio: "95%",
      operador: "Luiz Gonçalves",
      status: "Produzindo",
      ultima_parada: "01/05, 14:20",
    },
    {
      nome: "Corte a Laser",
      oee_atual: "0%",
      oee_medio: "60%",
      operador: "Luiz Gonçalves",
      status: "Setup",
      ultima_parada: "Hoje, 11:45",
    }
  ];



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
                  {turnos.length > 0 ? (
                    turnos.map((t) => (
                      <li key={t.id_turno}>
                        {t.nome_turno} ({t.dia_semana}): {new Date(t.hora_inicio).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(t.hora_fim).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </li>
                    ))
                  ) : (
                    <li className="text-gray-500 italic">Nenhum turno cadastrado para este setor</li>
                  )}
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
              <FormCriacaoTurno onSuccess={() => {
                // Recarregar turnos após criação
                turnoCrudService.getBySetor(id).then(res => {
                  if (res.sucesso) setTurnos(res.dados);
                });
              }} />
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

          {/* Listagem de Máquinas */}
          <div className="flex items-center justify-between w-full mt-3">
            <p>{dadosExibidos.length} máquinas encontradas</p>

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
          <div className="flex flex-col flex-1 items-center w-full mt-4">
            {dadosMaquina.length > 0 ? (
              /* dados só renderizam a tabela se tiver resultado */
              <TableListagens
                data={dadosMaquina}
                columns={colunaMaquinaSetor}
                acoesDropdown={(setor) => (
                  <>
                    <DropdownMenuItem asChild className="cursor-pointer">
                      <Link href={`setores/${setor.setor}`}>
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
                        <FormEdicaoMaquina />
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
                        <FormExclusaoMaquina />
                      </DialogContent>
                    </Dialog>

                  </>
                )}
              />
            ) : (
              /* se não tiver correspondência (length === 0), mostra apenas a div */
              <div className="flex flex-col items-center justify-center p-8 text-gray-500 w-full mt-4">
                <Search className="w-12 h-12 mb-4 text-gray-300" />
                <h2 className="text-xl font-semibold">Nenhum setor encontrado</h2>
                {/* <p>Não encontramos nenhum resultado para "{busca}".</p> */}
              </div>
            )}
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
            <p> {dadosExibidos.length} usuários encontrados</p>

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

          {/* Listagem */}
          <div className="flex flex-col flex-1 items-center w-full mt-4">
            {dadosExibidos.length > 0 ? (
              /* dados só renderizam a tabela se tiver resultado */
              <TableListagens
                data={dadosExibidos}
                columns={colunaUsuarioSetor}
                acoesDropdown={(setor) => (
                  <>
                    <DropdownMenuItem asChild className="cursor-pointer">
                      <Link href={`setores/${setor.setor}`}>
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
                        <FormEdicaoUsuario />
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
                        <FormExclusaoUsuario />
                      </DialogContent>
                    </Dialog>

                  </>
                )}
              />
            ) : (
              /* se não tiver correspondência (length === 0), mostra apenas a div */
              <div className="flex flex-col items-center justify-center p-8 text-gray-500 w-full mt-4">
                <Search className="w-12 h-12 mb-4 text-gray-300" />
                <h2 className="text-xl font-semibold">Nenhum setor encontrado</h2>
                {/* <p>Não encontramos nenhum resultado para "{busca}".</p> */}
              </div>
            )}
          </div>

        </section>



      </div>
    </main>
  );
}