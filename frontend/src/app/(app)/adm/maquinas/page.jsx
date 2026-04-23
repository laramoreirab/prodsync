"use client"

import { Plus, Search } from "lucide-react";
import FilterDropdown from "@/components/ui/FilterDropdown";
import OrdenarDropdown from "@/components/ui/OrdenarDropdown";
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

const dadosOriginais = [
  { id: 10, nome: 'Máquina A', status: 'Produzindo', setor: 'Engrenagens', data: '2026-04-09T10:00' },
  { id: 2, nome: 'Máquina C', status: 'Setup', setor: 'Roscas', data: '2026-04-08T15:30' },
  { id: 5, nome: 'Máquina B', status: 'Parada', setor: 'Engrenagens', data: '2026-04-08T16:24' },
];

export default function Maquinas() {
  const [dados, setDados] = useState(dadosOriginais);

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

  const aplicarFiltros = (filtrosSelecionados) => {
    let dadosFiltrados = [...dadosOriginais];

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
    { label: 'Ordem AlfabÃ©tica', value: 'nome' },
    { label: 'ID Crescente', value: 'id_asc' },
    { label: 'ID Decrescente', value: 'id_desc' },
    { label: 'Setor', value: 'setor' }
  ];

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 pb-10">
      <section className="flex items-center justify-between gap-4 pt-2">
        <div className="title_tela">
          <h1 className="underline decoration-secondary-foreground underline-offset-9 decoration-5 text-4xl font-semibold">
            Máquinas
          </h1>
        </div>
        <Dialog>
          <DialogTrigger className="flex items-center rounded-md bg-secondary-foreground px-4 py-1 text-xl font-semibold text-white">
            <Plus className="mr-2" />Cadastrar
          </DialogTrigger>

          <DialogContent className="top-0 left-0 right-0 max-w-none translate-x-0 translate-y-0 rounded-b-lg">
            <div className="flex items-center">
              <Plus className="mr-2" />
              <DialogTitle className="text-2xl">Cadastrar Máquina</DialogTitle>
            </div>
            <Separator className="m-2 bg-[#a6a6a6]" />
          </DialogContent>
        </Dialog>
      </section>

      <section id="listagem_maquinas" className="flex flex-col gap-5">
        <div className="flex items-center gap-5">
          <h1 className="w-[500px] text-4xl font-semibold">Inventário de Máquinas</h1>
          <hr className="h-1 flex-1 bg-black" />
        </div>

        <div className="flex searchbar">
          <div className="searchid flex w-full items-center justify-between rounded-md bg-[#EFEFEF] p-1">
            <input type="search" className="w-full bg-transparent p-2 outline-none" placeholder="Busque por nome ou id..." />
            <button className="mr-2 cursor-pointer outline-none"><Search /></button>
          </div>
        </div>

        <div className="row_ord_fil_cont mt-1 flex items-center justify-between">
          <p>{dados.length} máquinas encontradas</p>

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

        <div className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm">
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
              {dados.map(item => (
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
        </div>
      </section>
    </div>
  );
}
