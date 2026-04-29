"use client"

import { Plus, Search, Upload, File, Pencil, Trash2, Clock4 } from "lucide-react";
import FilterDropdown from "@/components/ui/filterDropdown";
import OrdenarDropdown from "@/components/ui/ordenarDropdown";
import React, { useState } from 'react';
import { useMaquinas } from '@/hooks/useMaquinas';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import FormCadastroMaquina from "@/components/ui/forms/maquinas/formCadastroMaquina";
import FormEdicaoMaquina from "@/components/ui/forms/maquinas/formEdicaoMaquina";
import FormExclusaoMaquina from "@/components/ui/forms/maquinas/formExclusaoMaquina";
import { useEffect } from 'react';
import { Loader2 } from "lucide-react";
//Widget imports - Dashboard
import { MaquinaStatusDonutWidget } from "@/features/maquinas/MaquinaStatusDonutWidget";
import { MaquinasPorSetorWidget } from "@/features/maquinas/MaquinasPorSetorWidget";
import { TempoMedioParadaWidget } from "@/features/maquinas/TempoMedioParadaWidget";
import { ProducaoDefeitosWidget } from "@/features/maquinas/ProducaoDefeitosWidget";
import { MaquinasPorTurnoWidget } from "@/features/maquinas/MaquinasPorTurnoWidget";
import { ProducaoTotalWidget } from "@/features/maquinas/ProducaoTotalWidget";


//imports da listagem
import TableListagens from "@/components/table";
import { Badge } from "@/components/ui/badge";



const maquinasFilter = [
  { id: "setor", label: "Setor", type: "checkbox", options: ["Roscas", "Engrenagens"] },
  { id: "status", label: "Status", type: "checkbox", options: ["Parada", "Produzindo", "Setup"] },
  { id: "data", label: "Parada", type: "date-range" }
];

const colunasMaquinas = [
  { id: 'id', key: 'id', label: 'ID', className: 'w-20 text-center justify-center' }, /* id da máquina */
  { id: 'nome', key: 'nome', label: 'Nome' },
  { id: 'setor', key: 'id_setor', label: 'Setor' },
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
  {
    id: 'ultimaParada', key: 'ultimaParada', label: 'Última parada',
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
      )
    }
  },
];

export default function Maquinas() {
  const { maquinas, loading, error, refresh, cadastrarMaquina, editarMaquina, excluirMaquina } = useMaquinas();
  const [dados, setDados] = useState([]);
  const [busca, setBusca] = useState("");
  const [maquinaSelecionada, setMaquinaSelecionada] = useState(null);

  //sincronizar dados da API com estado local
  useEffect(() => {
    setDados(maquinas);
  }, [maquinas]);

  //lógica de ordenação
  const handleSort = (criterio) => {
    const dadosCopiados = [...dados];

    dadosCopiados.sort((a, b) => {
      if (criterio === 'nome') return a.nome.localeCompare(b.nomeMaquina);
      if (criterio === 'id_asc') return a.id - b.id;
      if (criterio === 'id_desc') return b.id - a.id;
      if (criterio === 'setor') return a.id_setor.localeCompare(b.id_setor);
      return 0;
    });

    setDados(dadosCopiados);
  };

  const aplicarFiltros = (filtrosSelecionados) => {
    let dadosFiltrados = [...maquinas];

    //filtro por status
    if (filtrosSelecionados.status && filtrosSelecionados.status.length > 0) {
      dadosFiltrados = dadosFiltrados.filter(maq =>
        filtrosSelecionados.status.includes(maq.status)
      );
    }

    if (filtrosSelecionados.setor && filtrosSelecionados.setor.length > 0) {
      dadosFiltrados = dadosFiltrados.filter(maq =>
        filtrosSelecionados.setor.includes(maq.setor)
      );
    }

    //filtro por data (dia, literalmente, não é data de dados)
    if (filtrosSelecionados.data) {
      if (filtrosSelecionados.data.start) {
        dadosFiltrados = dadosFiltrados.filter(maq =>
          new Date(maq.data) >= new Date(filtrosSelecionados.data.start)
        );
      }
      if (filtrosSelecionados.data.end) {
        dadosFiltrados = dadosFiltrados.filter(maq =>
          new Date(maq.data) <= new Date(filtrosSelecionados.data.end)
        );
      }
    }

    setDados(dadosFiltrados);
  };

  const opcoesOrdenacao = [
    { label: 'Ordem Alfabética', value: 'nome' },
    { label: 'ID Crescente', value: 'id_asc' },
    { label: 'ID Decrescente', value: 'id_desc' },
    { label: 'Setor', value: 'setor' }
  ];

  //filtra os dados atuais (filtrados e ordenados) pelo termo de busca
  const dadosExibidos = dados.filter((maq) => {
    const termo = busca.toLowerCase();
    return (
      maq.nome.toLowerCase().includes(termo) ||
      maq.id.toString().includes(termo)
    );
  });

  //ações da tabela
  const abrirModalExclusao = (maquina) => {
    setMaquinaSelecionada(maquina);
  };

  //tela de carregamento enquanto busca os dados da API
  if (loading) {
    return (
      <main className="min-h-screen bg-[url('/bg_app.svg')] bg-cover bg-fixed bg-center bg-no-repeat flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-900 mb-4" />
          <p className="text-lg text-gray-600 font-medium">Carregando máquinas...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[url('/bg_app.svg')] bg-cover bg-fixed bg-center bg-no-repeat flex flex-col">

      <section className="graphs_cadastro">
        {/* Título da tela e do botão que leva ao modal de cadastro de máquina */}
        <div className="flex flex-wrap justify-between p-8">
          <div className="title_tela">
            <h1 className="underline decoration-secondary-foreground underline-offset-9 decoration-5 text-4xl font-semibold">
              Máquinas
            </h1>
          </div>
          {/* Modal de Cadastro */}
          <div className="modal_cadastro">
            <Dialog>
              <DialogTrigger className="bg-secondary-foreground px-4 py-1 rounded-md flex items-center text-white text-xl font-semibold">
                <Plus className="mr-2" />
                Cadastrar
              </DialogTrigger>

              <FormCadastroMaquina onCadastroSucesso={refresh} />
            </Dialog>
          </div>
        </div>
      </section>


      {/* Gráficos */}
      {/* SEÇÃO 1: Graphs */}
      <section className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Status Operacional */}
          <div className=" bg-white border rounded-xl p-4 flex flex-col items-center justify-start h-full">
            <p className="text-sm font-semibold text-black self-start">
              Status Operacional das Máquinas
            </p>
            <p className="text-xs text-gray-400 font-semibold mt-1 self-start mb-2">
              *Atualizado em tempo real
            </p>

            <div className="w-full">
              <MaquinaStatusDonutWidget />
            </div>
          </div>

          {/* Quantidade por Setor */}
          <div className=" bg-white border rounded-xl p-4">

            <MaquinasPorSetorWidget />
          </div>

          {/* Tempo Médio de Parada */}
          <div className="border bg-white rounded-xl p-4">
            <TempoMedioParadaWidget />
          </div>

        </div>
      </section>

      {/* SEÇÃO 2: Graphs */}
      <section className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Produção vs Defeitos por setor */}
          <div className="border bg-white rounded-xl p-4">
            <ProducaoDefeitosWidget />
          </div>

          {/* Status por Turno */}
          <div className="border bg-white rounded-xl p-4">
            <MaquinasPorTurnoWidget />
          </div>

        </div>
      </section>

      {/* SEÇÃO 3:Graphs*/}
      <section className="p-6">
        <div className="border bg-white rounded-xl p-4">
          <ProducaoTotalWidget />
        </div>
      </section>

      {/* LISTAGEM MAQUINAS */}
      <section id="listagem_maquinas">
        <div className="flex items-center p-8 gap-5">
          <h1 className="text-4xl w-[125] font-semibold">Inventário de Máquinas</h1>
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

        <div className="row_ord_fil_cont flex items-center justify-between px-8 mt-3">
          <p>{dadosExibidos.length} máquinas encontradas</p>

          <div className="flex items-center gap-4">
            <OrdenarDropdown
              label="Ordenar por"
              options={opcoesOrdenacao}
              onSortChange={handleSort}
            />

            <FilterDropdown
              filtersConfig={maquinasFilter}
              onApply={aplicarFiltros}
            />
          </div>
        </div>

        {/* tabela temporária, apenas para testes */}
        <div className="flex flex-col flex-1 items-center w-full mt-4 px-8">
          {dadosExibidos.length > 0 ? (

            <TableListagens
              /* Dados e colunas a depender da página [no momento está estático definido em um json, posteriormente será um get]  */
              data={dadosExibidos} columns={colunasMaquinas}

              // 1. Para a ação "ver detalhes" Url com base na linha clicada
              viewLink={(row) => `/adm/maquinas/${row.id}`}

              // 2.  modais de Editar e Excluir para a tabela renderizar
              dialogs={{
                edit: (row) => (
                  <DialogContent className="rounded-lg top-0 left-0 right-0 translate-x-0 translate-y-0 w-full max-w-none">
                    <FormEdicaoMaquina maquinaId={row.id} onEdicaoSucesso={refresh} />
                    {/* colocar {row.nome} e assim por diante no placehoder pra saber o que está sendo editado */}
                  </DialogContent>
                ),
                delete: (row) => (
                  <DialogContent>
                    <FormExclusaoMaquina maquinaId={row.id} onExclusaoSucesso={refresh} />
                  </DialogContent>
                )
              }}
            />
          ) : (
            //caso não encontre nada correspondente
            <div className="flex flex-col items-center justify-center p-8 text-gray-500">
              <Search className="w-12 h-12 mb-4 text-gray-300" />
              <h2 className="text-xl font-semibold">Nenhum usuário encontrado</h2>
              <p>Não encontramos nenhum resultado "{busca}".</p>
            </div>
          )}
        </div>
      </section>

    </main >
  );
}