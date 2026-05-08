"use client"

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { useOps } from "@/hooks/useOps";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, ArrowDown, Flame, MoveHorizontal, Pencil, Plus, Search, Loader2, EyeIcon, Trash2 } from 'lucide-react';
import TableListagens from "@/components/table";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import OrdenarDropdown from "@/components/ui/OrdenarDropdown";
import FilterDropdown from "@/components/ui/FilterDropdown";
import Link from "next/link";

const dadosOriginais = [
  { id: 1, nome: 'Ana Silva', prioridade: 'Baixa', setor: 'Escavadeiras', status: 'Produzindo', progresso: '25%' },
  { id: 2, nome: 'Carlos Souza', prioridade: 'Crítica', setor: 'Gestor', status: 'Setup', progresso: '35%' },
  { id: 3, nome: 'Bruno Costa', prioridade: 'Alta', setor: 'Operador', status: 'Parada', progresso: '55%' },
  { id: 4, nome: 'Bia Gonçalves', prioridade: 'Média', setor: 'Gestor', status: 'Setup', progresso: '85%' },
  { id: 5, nome: 'Julia Silva', prioridade: 'Baixa', setor: 'Gestor', status: 'Aguardando Início', progresso: '15%' },
  { id: 6, nome: 'Carol Silva', prioridade: 'Baixa', setor: 'Gestor', status: 'Aguardando Início', progresso: '15%' },
  { id: 7, nome: 'Guilherme Santos', prioridade: 'Baixa', setor: 'Gestor', status: 'Aguardando Início', progresso: '15%' },
  { id: 8, nome: 'Felipe Moraes', prioridade: 'Baixa', setor: 'Gestor', status: 'Concluída', progresso: '15%' },
  { id: 9, nome: 'Arthur Martins', prioridade: 'Baixa', setor: 'Gestor', status: 'Aguardando Início', progresso: '15%' },
];

const opsFilter = [
  { id: "status_op", label: "Status", type: "checkbox", options: ["Aguardando", "Concluída", "Produzindo", "Parada", "Setup"] },
  { id: "prioridade", label: "Prioridade", type: "checkbox", options: ["Crítica", "Alta", "Média", "Baixa"] },
  { id: "progresso", label: "Progresso", type: "number-range" }
];


export default function OrdensDeProducao() {

  const colunasOrdemProd = [
    {
      id: "id",
      key: "id",
      label: "ID",
      className: "w-25 text-center justify-center"
    },
    {
      id: "prioridade",
      key: "prioridade",
      label: "Prioridade",
      className: "lg:pl-25 w-40",
      icone: (valor) => {
        const config = {
          "Média": {
            variant: "outline",
            className: "border border-[var(--azul-cobalto)]",
            icon: <MoveHorizontal className="text-azul-cobalto" />
          },
          "Alta": {
            variant: "secondary",
            className: "border border-[var(--amarelo)] bg-transparent",
            icon: <AlertTriangle className="text-amarelo" />
          },
          "Crítica": {
            variant: "destructive",
            className: "border border-[var(--vermelho-vivido)] bg-transparent text-black",
            icon: <Flame className="text-vermelho-vivido" />
          },
          "Baixa": {
            variant: "destructive",
            className: "border border-gray-400 text-sm bg-transparent text-black",
            icon: <ArrowDown className="text-gray-400" />
          }
        };

        const item = config[valor] || { icon: null };
        return (
          <Badge variant="outline" className={`whitespace-nowrap ${item.className} text-sm font-medium p-2.5`}>
            {item.icon}
            {valor}
          </Badge>
        );
      }
    },
    {
      id: "status",
      key: "status_op",
      label: 'Status',
      className: "text-center",
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
            className: "bg-vermelho-vivido/10 text-vermelho-vivido font-semibold text-sm border-none"
          },
          "Concluída": {
            variant: "outline",
            className: "bg-blue-500/10 text-blue-600 text-sm font-semibold border-none"
          },
          "Aguardando Início": {
            variant: "outline",
            className: "bg-[#ECECEC] text-[#636F87] text-sm font-semibold border-none"
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
      id: "progresso",
      key: "progresso",
      label: "Progresso",
      className: "text-center"
    },
  ];

  const { ops, loading, error, refresh } = useOps();
  const [dados, setDados] = useState([]);
  const [busca, setBusca] = useState("");
  
  useEffect(() => {
    setDados(ops);
  }, [ops]);


  //lógica de ordenação
  const handleSort = (criterio) => {
    const dadosCopiados = [...dados];


    dadosCopiados.sort((a, b) => {
      if (criterio === 'id_asc') return a.id - b.id;
      if (criterio === 'id_desc') return b.id - a.id;
      if (criterio === 'progresso_asc') return a.progresso - b.progresso;
      if (criterio === 'progresso_desc') return b.progresso - a.progresso;
      return 0;
    });


    setDados(dadosCopiados);
  };


  const aplicarFiltros = (filtrosSelecionados) => {
    let dadosFiltrados = [...ops]; // usa o estado da API, não array estático


    //filtro por status
    if (filtrosSelecionados.status_op && filtrosSelecionados.status_op.length > 0) {
      dadosFiltrados = dadosFiltrados.filter(op =>
        filtrosSelecionados.status_op.includes(op.status_op)
      );
    }

    //filtro por prioridade
    if (filtrosSelecionados.prioridade?.length) {
      dadosFiltrados = dadosFiltrados.filter(op =>
        filtrosSelecionados.prioridade.includes(op.prioridade)
      );
    }

    //filtro por progresso (intervalo)
    if (filtrosSelecionados.progresso) {
      const { min, max } = filtrosSelecionados.progresso;
      if (min !== undefined) dadosFiltrados = dadosFiltrados.filter(op => op.progresso >= min);
      if (max !== undefined) dadosFiltrados = dadosFiltrados.filter(op => op.progresso <= max);
    }


    setDados(dadosFiltrados);
  };



  const opcoesOrdenacao = [
    { label: 'ID Crescente', value: 'id_asc' },
    { label: 'ID Decrescente', value: 'id_desc' },
    { label: 'Progresso Crescente', value: 'progresso_asc' },
    { label: 'Progresso Decrescente', value: 'progresso_desc' },
  ];


  //filtra os dados atuais (filtrados e ordenados) pelo termo de busca
  const dadosExibidos = dados.filter((op) => {
    const termo = (busca || "").toLowerCase();

    const nome = op?.nome?.toLowerCase() || "";
    const id = op?.id?.toString() || "";

    return (
      nome.includes(termo) ||
      id.includes(termo)
    );
  });

  //tela de carregamento enquanto busca os dados da API
  if (loading) {
    return (
      <main className="min-h-screen bg-[url('/bg_app.svg')] bg-cover bg-fixed bg-center bg-no-repeat flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-900 mb-4" />
          <p className="text-lg text-gray-600 font-medium">Carregando ordens de produção...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[url('/bg_app.svg')] bg-cover bg-fixed bg-center bg-no-repeat flex flex-col">
      <div className="w-full mt-8 pb-10 px-8 space-y-4">

        {/* TÍTULO */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="underline decoration-secondary-foreground underline-offset-9 decoration-5 text-4xl font-semibold mb-4">
            Ordens de Produção
          </h1>
        </div>

        {/*SEÇÃO 1: KPIS*/}
        <div className="grid grid-cols-5 gap-6 w-full">

          <div className="col-span-1 bg-[#efefef] p-5 flex flex-col gap-15 rounded-lg shadow-sm h-60">
            <h1 className="text-[#545454] text-lg text-center font-semibold align-text-top">Aguardando Início</h1>

            <span className="text-black text-center text-4xl font-bold">2</span>

          </div>

          <div className="col-span-1 bg-[#effff5] p-5 flex flex-col gap-15 rounded-lg shadow-sm">
            <h1 className="text-[#369948] text-lg text-center font-semibold">Em Andamento</h1>
            <span className="text-black text-4xl text-center font-bold">3</span>
          </div>

          <div className="col-span-1 bg-[#e8f0ff] p-6 flex flex-col gap-15 rounded-lg shadow-sm">
            <h1 className="text-[#00357a] text-lg text-center font-semibold">Concluídas</h1>
            <span className="text-black text-4xl text-center font-bold">4</span>
          </div>


          <div className="col-span-2 bg-white border border-gray-100 shadow-sm p-4 rounded-lg flex flex-col justify-between gap-2">

            {/* Aqui */}

          </div>
        </div>

        <section id="listagem_ops">
          <div className="flex items-center py-8 gap-5">
            <h1 className="text-4xl font-semibold">OPs</h1>
            <hr className="bg-black flex-1 h-1" />
          </div>

          {/* Busca */}
          <div className="flex searchbar">
            <div className="flex searchid items-center w-full p-1 justify-between rounded-md bg-[#EFEFEF]">
              <input
                type="search"
                className="p-2 w-full outline-none bg-transparent"
                placeholder="Busque por id, nome ou lote..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
              />
              <button className="outline-none cursor-pointer mr-2">
                <Search />
              </button>
            </div>
          </div>

          <div className="row_ord_fil_cont flex items-center py-3 justify-between mt-3">
            <p>{dadosExibidos.length} OPs encontradas</p>

            <div className="flex items-center gap-4">
              <OrdenarDropdown
                label="Ordenar por"
                options={opcoesOrdenacao}
                onSortChange={handleSort}
              />
              <FilterDropdown
                filtersConfig={opsFilter}
                onApply={aplicarFiltros}
              />
            </div>
          </div>

          {/* Tabela */}
          {dadosExibidos.length > 0 ? (
            <TableListagens
              /* Dados e colunas a depender da página [no momento está estático definido em um json, posteriormente será um get]  */
              data={dadosExibidos}
              columns={colunasOrdemProd}
              acoesDropdown={(ordemProd) => (
                <>
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link href={`ordensDeProducao/${ordemProd.id}`}>
                      <EyeIcon className="mr-2 h-4 w-4" />
                      Ver Detalhes
                    </Link>
                  </DropdownMenuItem>
                </>
              )}
            />
          ) : (
            <div className="flex flex-col items-center justify-center p-12 rounded-md mt-4">
              <Search className="w-12 h-12 text-gray-300 mb-3" />
              <p className="text-xl font-semibold text-gray-500">Nenhum resultado encontrado</p>
              <p className="text-sm text-gray-400 mt-1">Ajuste seus filtros ou termo de busca.</p>
            </div>
          )}
        </section>

        {/* Tabela sem filtros ainda */}
        <section>
          <h1>Historico de Eventos da OP</h1>
          <TableListagens
            /* Dados e colunas a depender da página [no momento está estático definido em um json, posteriormente será um get]  */
            data={dadosOriginais}
            columns={colunasOrdemProd}
            acoesDropdown={(ordemProd) => (
              <>
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link href={`ordensDeProducao/${ordemProd.id}`}>
                    <EyeIcon className="mr-2 h-4 w-4" />
                    Ver Detalhes
                  </Link>
                </DropdownMenuItem>
              </>
            )}
          />
        </section>

      </div>
    </main>
  );
}