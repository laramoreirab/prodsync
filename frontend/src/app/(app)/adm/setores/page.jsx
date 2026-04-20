"use client"

import Header from "@/components/ui/topbar";
import React, { useState } from 'react';
import { OEEPorSetorWidget } from "@/features/setores/OEEPorSetorWidget";
import { RefugoPorSetorWidget } from "@/features/setores/RefugoPorSetorWidget";
import { OEECriticoWidget } from "@/features/setores/OEECriticoWidget";
import { SetorTotalWidget } from "@/features/setores/SetorTotalKPIWidget";
import { OperadoresMediaWidget } from "@/features/setores/OperadoresMediaKPIWidget";
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


const setoresFilter = [
  { id: "setor", label: "Setor", type: "checkbox", options: ["Roscas", "Engrenagens"] },//backend que vai enviar as options posteriormente
  { id: "oeeMedioSetor", label: "OEE Médio", type: "number-range" },
  { id: "qtdMaquinasSetor", label: "Qtd. de Máquinas", type: "number-range" },
  { id: "qtdOperadoresSetor", label: "Qtd. de Operadores", type: "number-range" },
];

const dadosOriginais = [
  { setor: "roscas", gestor: "Luiz Mariz", OEE_Médio: '76%', QTD_De_Máquinas: 67, QTD_De_Operadores: 60 },
  { setor: "engrenagens", gestor: "Luiza Mariza", OEE_Médio: '78%', QTD_De_Máquinas: 60, QTD_De_Operadores: 58 },
  { setor: "brocas", gestor: "Estevão Ferreira", OEE_Médio: '77%', QTD_De_Máquinas: 50, QTD_De_Operadores: 34 },
];

export default function PageLayout() {

  //estado que vai para a tela (começa com todos os dados)
  const [dados, setDados] = useState(dadosOriginais);
  const [busca, setBusca] = useState("");

  //lógica de ordenação
  const handleSort = (criterio) => {
    const dadosCopiados = [...dados];

    dadosCopiados.sort((a, b) => {
      //transformando string em numero
      const parseOEE = (valor) => parseFloat(valor.replace('%', ''));

      switch (criterio) {
        case 'nome':
          return a.setor.localeCompare(b.setor);
        case 'oee_asc':
          return parseOEE(a.OEE_Médio) - parseOEE(b.OEE_Médio);
        case 'oee_desc':
          return parseOEE(b.OEE_Médio) - parseOEE(a.OEE_Médio);
        case 'qtdMaquinas_asc':
          return a.QTD_De_Máquinas - b.QTD_De_Máquinas;
        case 'qtdMaquinas_desc':
          return b.QTD_De_Máquinas - a.QTD_De_Máquinas;
        case 'qtdOperadores_asc':
          return a.QTD_De_Operadores - b.QTD_De_Operadores;
        case 'qtdOperadores_desc':
          return b.QTD_De_Operadores - a.QTD_De_Operadores;
        default:
          return 0;
      }
    });

    setDados(dadosCopiados);
  };

  const aplicarFiltros = (filtrosSelecionados) => {
    let dadosFiltrados = [...dadosOriginais];

    //filtro por setor
    if (filtrosSelecionados.setor && filtrosSelecionados.setor.length > 0) {
      dadosFiltrados = dadosFiltrados.filter(item =>
        filtrosSelecionados.setor.some(f => f.toLowerCase() === item.setor.toLowerCase())
      );
    }

    // filtro por oee médio
    if (filtrosSelecionados.oeeMedioSetor) {
      const { min, max } = filtrosSelecionados.oeeMedioSetor;
      dadosFiltrados = dadosFiltrados.filter(item => {
        const valor = parseFloat(item.OEE_Médio.replace('%', ''));
        return valor >= (min || 0) && valor <= (max || 100); //se usuario nao prencher minimo, o minimo assume zero; se usuario nao prencher maximo, o max assume 100 (pois é porcentagem)
      });
    }

    //filtro por qtd de máquinas
    if (filtrosSelecionados.qtdMaquinasSetor) {
      const { min, max } = filtrosSelecionados.qtdMaquinasSetor;
      dadosFiltrados = dadosFiltrados.filter(item =>
        item.QTD_De_Máquinas >= (min || 0) && item.QTD_De_Máquinas <= (max || Infinity) //se usuario nao prencher minimo, o minimo assume zero; se usuario nao prencher maximo, o max assume infinito
      );
    }

    //filtro por qtd de operadores
    if (filtrosSelecionados.qtdOperadoresSetor) {
      const { min, max } = filtrosSelecionados.qtdOperadoresSetor;
      dadosFiltrados = dadosFiltrados.filter(item =>
        item.QTD_De_Operadores >= (min || 0) && item.QTD_De_Operadores <= (max || Infinity) //se usuario nao prencher minimo, o minimo assume zero; se usuario nao prencher maximo, o max assume infinito
      );
    }

    setDados(dadosFiltrados);
  };

  const opcoesOrdenacao = [
    { label: 'Ordem Alfabética', value: 'nome' },
    { label: 'OEE Crescente', value: 'oee_asc' },
    { label: 'OEE Decrescente', value: 'oee_desc' },
    { label: 'Qtd. Máquinas Crescente', value: 'qtdMaquinas_asc' },
    { label: 'Qtd. Máquinas Decrescente', value: 'qtdMaquinas_desc' },
    { label: 'Qtd. Operadores Crescente', value: 'qtdOperadores_asc' },
    { label: 'Qtd. Operadores Decrescente', value: 'qtdOperadores_desc' },
  ];

  //filtra os dados atuais (filtrados e ordenados) pelo termo de busca
  const dadosExibidos = dados.filter((setor) => {
    const termo = busca.toLowerCase();
    return (
      setor.setor.toLowerCase().includes(termo) ||
      setor.gestor.toString().includes(termo)
    );
  });

  return (
    <main
      className="relative min-h-screen w-full flex flex-col overflow-x-hidden"
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

      <div className="w-full mt-2 pt-0 pb-10 px-4 space-y-4">
        <section className="graphs_cadastro">
          {/* Título da tela e do botão que leva ao modal de cadastro do setor */}
          <div className="flex justify-between p-8">
            <div className="title_tela">
              <h1 className="underline decoration-secondary-foreground underline-offset-9 decoration-5 text-4xl font-semibold">
                Setores
              </h1>
            </div>

            {/* Modal de Criar Setor*/}
            <Dialog>

              <DialogTrigger className="bg-secondary-foreground px-4 py-1 rounded-md flex items-center text-white text-xl font-semibold">
                <Plus className="mr-2" />Criar
              </DialogTrigger>

              <DialogContent className="top-0 left-0 right-0 translate-x-0 translate-y-0 w-full max-w-none rounded-b-lg">
                <div className="flex items-center">
                  <div className="bg-blue-900 flex items-center px-4 py-2 rounded-md">
                    <Plus className="mr-2 text-3xl text-white" />
x                    <DialogTitle className="text-3xl text-white">Criar Setor</DialogTitle>
                  </div>
                </div>
                <Separator className="m-2 bg-[#a6a6a6]" />
              </DialogContent>

              <form className="px-8 pb-8 pt-4 flex flex-col gap-6">

              </form>

            </Dialog>
          </div>
        </section>
      </div>

      {/* Gráficos */}
      <div className="flex flex-col gap-4 p-4">
        {/* SEÇÃO 1 — KPIs de Topo (1/4, 1/4, 1/2) */}
        <section className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="sm:col-span-1 bg-white border border-gray-100 rounded-xl p-6 shadow-sm flex flex-col items-center justify-center">
            <SetorTotalWidget />
          </div>

          <div className="sm:col-span-1 bg-white border border-gray-100 rounded-xl p-6 shadow-sm flex flex-col items-center justify-center">
            <OperadoresMediaWidget />
          </div>

          <div className="sm:col-span-2 bg-white border border-gray-100 rounded-xl p-6 shadow-sm flex flex-col items-center justify-center">
            <OEEPorSetorWidget />
          </div>
        </section>

        {/* SEÇÃO 2 — Gráficos Principais (Refugo e Gauge) */}

        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
            <RefugoPorSetorWidget />
          </div>

          <div className="md:col-span-1 bg-white border border-gray-100 rounded-xl p-6 shadow-sm flex flex-col items-center justify-center">
            <OEECriticoWidget />
          </div>
        </section>

      </div>

      <section className="listagem_setores">
        <div className="flex items-center p-8 gap-5">
          <h1 className="text-4xl w-[125] font-semibold">Listagem de Usuários</h1>
          <hr className="bg-black flex-1 h-1" />
        </div>
        {/* Busca */}
        <div className="flex px-8 searchbar">
          <div className="flex searchid items-center w-full p-1 justify-between rounded-md bg-[#EFEFEF]">
            <input
              type="search"
              className="p-2 w-full outline-none bg-transparent"
              placeholder="Busque por nome ou gestor..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
            <button className="outline-none cursor-pointer mr-2"><Search /></button>
          </div>
        </div>

        {/* Linha de quantidade total de setores e filtrar e ordenar funcional */}
        <div className="row_ord_fil_cont flex items-center justify-between px-8 mt-3">

          <p>{dadosExibidos.length} setores encontrados.</p>

          <div className="flex gap-4 items-center">
            <OrdenarDropdown
              label="Ordenar por"
              options={opcoesOrdenacao}
              onSortChange={handleSort}
            />

            <FilterDropdown
              filtersConfig={setoresFilter}
              onApply={aplicarFiltros}
            />
          </div>

        </div>

        {/* tabela temporária, apenas para testes */}
        <div className="px-8 mt-5 pb-10 w-full">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 w-full overflow-x-auto">

            {dadosExibidos.length > 0 ? (
              /* dados só renderizam a tabela se tiver resultado */
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 text-left text-gray-600">
                    <th className="p-3">Setor</th>
                    <th className="p-3">OEE Médio</th>
                    <th className="p-3">Qtd. de Máquinas</th>
                    <th className="p-3">Qtd. de Operadores</th>
                  </tr>
                </thead>
                <tbody>
                  {dadosExibidos.map((item, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="p-3 font-medium capitalize">{item.setor}</td>
                      <td className="p-3">{item.OEE_Médio}</td>
                      <td className="p-3">{item.QTD_De_Máquinas}</td>
                      <td className="p-3">{item.QTD_De_Operadores}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              /* se não tiver correspondência (length === 0), mostra apenas a div */
              <div className="flex flex-col items-center justify-center p-8 text-gray-500 w-full mt-4">
                <Search className="w-12 h-12 mb-4 text-gray-300" />
                <h2 className="text-xl font-semibold">Nenhum setor encontrado</h2>
                <p>Não encontramos nenhum resultado para "{busca}".</p>
              </div>
            )}

          </div>
        </div>
      </section>

    </main >
  );
}