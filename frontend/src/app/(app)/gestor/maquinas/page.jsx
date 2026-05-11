"use client";

import { useState, useEffect } from "react";
import { MaquinaStatusDonutWidget } from "@/features/maquinas/MaquinaStatusDonutWidget";
import { MaquinasPorSetorWidget } from "@/features/maquinas/MaquinasPorSetorWidget";
import { TempoMedioParadaWidget } from "@/features/maquinas/TempoMedioParadaWidget";
import { ProducaoDefeitosWidget } from "@/features/maquinas/ProducaoDefeitosWidget";
import { MaquinasPorTurnoWidget } from "@/features/maquinas/MaquinasPorTurnoWidget";
import { ProducaoTotalWidget } from "@/features/maquinas/ProducaoTotalWidget";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Search, Loader2 } from "lucide-react";
import OrdenarDropdown from "@/components/ui/OrdenarDropdown";
import FilterDropdown from "@/components/ui/FilterDropdown";
import { useMaquinas } from '@/hooks/useMaquinas';
import FormCadastroMaquina from "@/components/ui/forms/maquinas/formCadastroMaquina";

export default function MaquinasGestor() {
  const { maquinas, loading, error, refresh, cadastrarMaquina, editarMaquina, excluirMaquina } = useMaquinas();
  const [dados, setDados] = useState([]);
  const [busca, setBusca] = useState("");
  const [maquinaSelecionada, setMaquinaSelecionada] = useState(null);

  //sincronizar dados da API com estado local
  useEffect(() => {
    setDados(maquinas);
  }, [maquinas]);

  const opcoesOrdenacao = [
    { label: 'Ordem Alfabética', value: 'nome' },
    { label: 'ID Crescente', value: 'id_asc' },
    { label: 'ID Decrescente', value: 'id_desc' },
    { label: 'OEE Crescente', value: 'oee_asc' },
    { label: 'OEE Decrescente', value: 'oee_desc' }
  ];

  //lógica de ordenação
  const handleSort = (criterio) => {
    const dadosCopiados = [...dados];

    dadosCopiados.sort((a, b) => {
      if (criterio === 'nome') return a.nome.localeCompare(b.nome);
      if (criterio === 'id_asc') return a.id - b.id;
      if (criterio === 'id_desc') return b.id - a.id;
      // precisa implementar oee asc e desc

      return 0;
    });

    setDados(dadosCopiados);
  };

  const maquinasFilter = [
    { id: "status", label: "Status", type: "checkbox", options: ["Parada", "Produzindo", "Setup"] },
    { id: "oee", label: "OEE", type: "number-range" }
  ];

  const aplicarFiltros = (filtrosSelecionados) => {
    let dadosFiltrados = [...maquinas];
    // precisa implementar
    setDados(dadosFiltrados);
  };

  //filtra os dados atuais (filtrados e ordenados) pelo termo de busca
  const dadosExibidos = dados.filter((maq) => {
    const termo = busca.toLowerCase();
    return (
      maq.nome.toLowerCase().includes(termo) ||
      maq.id.toString().includes(termo)
    );
  });

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
      <div className="p-8">
        <div className="flex justify-between items-center">
          <h1 className="underline decoration-secondary-foreground underline-offset-9 decoration-5 text-4xl font-semibold">
            Máquinas
          </h1>
          <Dialog>
            <DialogTrigger className="bg-secondary-foreground px-4 py-1 rounded-md flex items-center text-white text-xl font-semibold cursor-pointer">
              <Plus className="mr-2" />
              Cadastrar
            </DialogTrigger>

            <DialogContent>
              <FormCadastroMaquina />
            </DialogContent>
          </Dialog>
        </div>

        {/* Gráficos */}
        <div className="flex flex-col gap-4 ">
          <section className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white border rounded-xl p-4 flex flex-col items-center justify-start h-full">
                <p className="text-sm font-semibold text-black self-start">Status Operacional das Máquinas</p>
                <p className="text-xs text-gray-400 font-semibold mt-1 self-start mb-2">*Atualizado em tempo real</p>
                <div className="w-full">
                  <MaquinaStatusDonutWidget />
                </div>
              </div>
              <div className="bg-white border rounded-xl p-4">
                <MaquinasPorSetorWidget />
              </div>
              <div className="border bg-white rounded-xl p-4">
                <TempoMedioParadaWidget />
              </div>
            </div>
          </section>

          <section>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border bg-white rounded-xl p-4">
                <ProducaoDefeitosWidget />
              </div>
              <div className="border bg-white rounded-xl p-4">
                <MaquinasPorTurnoWidget />
              </div>
            </div>
          </section>

          <section>
            <div className="border bg-white rounded-xl p-4">
              <ProducaoTotalWidget />
            </div>
          </section>
        </div>


        {/* LISTAGEM MAQUINAS */}
        <section id="listagem_maquinas">
          <div className="flex items-center gap-5 mt-8">
            <h1 className="text-4xl font-semibold">Inventário de Máquinas</h1>
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
        </section>

        {/* Tabela */}

      </div>


    </main>
  );
}