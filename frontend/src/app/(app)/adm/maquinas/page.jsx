"use client"

import Header from "@/components/ui/topbar";
import { Plus, Search } from "lucide-react";
import FilterDropdown from "@/components/ui/filterDropdown";
import OrdenarDropdown from "@/components/ui/ordenarDropdown";
import React, { useState } from 'react';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

const maquinasFilter = [
  { id: "setor", label: "Setor", type: "checkbox", options: ["Roscas", "Engrenagens"] },
  { id: "status", label: "Status", type: "checkbox", options: ["Parada", "Produzindo", "Setup"] },
  { id: "data", label: "Parada", type: "date-range" }
];

//guardear os dados originais intactos aqui fora, pois assim,
//  quando o usuário limpar o filtro, a tabela consegue voltar ao normal.

const dadosOriginais = [
  { id: 10, nome: 'Máquina A', status: 'Produzindo', setor: 'Engrenagens', data: '2026-04-09T10:00' },
  { id: 2, nome: 'Máquina C', status: 'Setup', setor: 'Roscas', data: '2026-04-08T15:30' },
  { id: 5, nome: 'Máquina B', status: 'Parada', setor: 'Engrenagens', data: '2026-04-08T16:24' },
];

export default function Maquinas() {
  //estado que vai para a tela (começa com todos os dados)
  const [dados, setDados] = useState(dadosOriginais);
  const [busca, setBusca] = useState("");

  //lógica de ordenação
  const handleSort = (criterio) => {
    const dadosCopiados = [...dados];

    dadosCopiados.sort((a, b) => {
      if (criterio === 'nome') return a.nome.localeCompare(b.nome);
      if (criterio === 'id_asc') return a.id - b.id;
      if (criterio === 'id_desc') return b.id - a.id;
      return 0;
    });

    setDados(dadosCopiados);
  };

  //recebendo os filtros do dropdown e atualizando a tabela
  const aplicarFiltros = (filtrosSelecionados) => {
    //filtra a partir da lista original completa
    let dadosFiltrados = [...dadosOriginais];

    //filtro por setor
    if (filtrosSelecionados.status && filtrosSelecionados.status.length > 0) {
      dadosFiltrados = dadosFiltrados.filter(maq =>
        filtrosSelecionados.status.includes(maq.status)
      );
    }

    //filtro por setor
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

  return (
    <main className="min-h-screen bg-[url('/bg_app.svg')] bg-cover bg-fixed bg-center bg-no-repeat flex flex-col">
      <Header />

      <section className="graphs_cadastro">
        {/* Título da tela e do botão que leva ao modal de cadastro de máquina */}
        <div className="flex justify-between p-8">
          <div className="title_tela">
            <h1 className="underline decoration-secondary-foreground underline-offset-9 decoration-5 text-4xl font-semibold">
              Máquinas
            </h1>
          </div>
          <Dialog>

            <DialogTrigger className="bg-secondary-foreground px-4 py-1 rounded-md flex items-center text-white text-xl font-semibold">
              <Plus className="mr-2" />
              Cadastrar
            </DialogTrigger>

            <DialogContent className="top-0 left-0 right-0 translate-x-0 translate-y-0 w-full max-w-none rounded-b-lg">
              <div className="flex items-center">
                <Plus className="mr-2" />
                <DialogTitle className="text-2xl">Cadastrar Máquina</DialogTitle>
              </div>
              <Separator className="m-2 bg-[#a6a6a6]" />
            </DialogContent>

          </Dialog>
        </div>
      </section>

      {/* Listagem */}
      <section id="listagem_maquinas">
        <div className="flex items-center p-8 gap-5">
          <h1 className="text-4xl w-[500px] font-semibold">Inventário de Máquinas</h1>
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

          <div className="flex gap-4 items-center">
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
        <div className="px-8 mt-5">
          {dadosExibidos.length === 0 ? (
            // Mensagem renderizada fora da tabela quando não há dados
            <div className="flex flex-col items-center justify-center p-8 text-gray-500 w-full mt-10">
              <Search className="w-12 h-12 mb-4 text-gray-300" />
              <h2 className="text-xl font-semibold">Nenhuma máquina encontrada</h2>
              <p>Não encontramos nenhum resultado para "{busca}".</p>
            </div>
          ) : (
            // A tabela inteira (com thead e tbody) só aparece se houver dados
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b text-left">
                  <th className="p-2">ID</th>
                  <th className="p-2">Nome</th>
                  <th className="p-2">Status</th>
                  <th className="p-2">Setor</th>
                  <th className="p-2">Data Parada</th>
                </tr>
              </thead>
              <tbody>
                {dadosExibidos.map((item) => (
                  <tr key={item.id} className="border-b">
                    <td className="p-2">{item.id}</td>
                    <td className="p-2">{item.nome}</td>
                    <td className="p-2">{item.status}</td>
                    <td className="p-2">{item.setor}</td>
                    <td className="p-2">{item.data.replace("T", " ")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

      </section>
    </main>
  );
}