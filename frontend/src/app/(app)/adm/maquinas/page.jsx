"use client"

import Header from "@/components/ui/topbar";
import { Plus, Search, Upload, File, Pencil, Trash2 } from "lucide-react"; // Adicionei Pencil e Trash2
import FilterDropdown from "@/components/ui/filterDropdown";
import OrdenarDropdown from "@/components/ui/ordenarDropdown";
import React, { useState } from 'react';
import { useMaquinas } from '@/hooks/useMaquinas';
import { maquinaCrudService } from '@/services/maquinaCrudService';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

//Widget imports - Dashboard
import { MaquinaStatusDonutWidget } from "@/features/maquinas/MaquinaStatusDonutWidget";
import { MaquinasPorSetorWidget } from "@/features/maquinas/MaquinasPorSetorWidget";
import { TempoMedioParadaWidget } from "@/features/maquinas/TempoMedioParadaWidget";
import { ProducaoDefeitosWidget } from "@/features/maquinas/ProducaoDefeitosWidget";
import { MaquinasPorTurnoWidget } from "@/features/maquinas/MaquinasPorTurnoWidget";
import { ProducaoTotalWidget } from "@/features/maquinas/ProducaoTotalWidget";

//

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

  // estados para contralar os modais
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [maquinaSelecionada, setMaquinaSelecionada] = useState(null);

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

    //filtro por status
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

  const {
    formData,
    arquivo,
    fileInputRef,
    handleInputChange,
    handleUploadClick,
    handleFileChange,
    preencherParaEdicao, // função do hook
    limparFormulario
  } = useMaquinas();

  // função de envio
  const handleSubmitPreparado = async (e) => {
    e.preventDefault();
    const payload = new FormData();

    payload.append("nome", formData.nomeMaquina);
    payload.append("id_maquina", formData.idMaquina);
    payload.append("setor", formData.setorMaquina);
    payload.append("capacidadeNormal", formData.capacidadeNormalMaquina);
    payload.append("tipoMaquina", formData.tipoMaquina);
    payload.append("dataAquisicao", formData.dataAquisicaoMaquina);
    payload.append("operador", formData.operadorMaquina);
    payload.append("status", formData.statusMaquina);

    if (arquivo && arquivo.raw) {
      payload.append("imagem", arquivo.raw);
    }

    try {
      const resposta = await maquinaCrudService.cadastrar(payload);

      console.log("Cadastro realizado com sucesso!", resposta);
      setIsCreateOpen(false);
      limparFormulario(); 

    } catch (erro) {
      console.error("Erro ao enviar a requisição:", erro);
    }
  };

  //ações da tabela
  const abrirModalEdicao = (maquina) => {
    preencherParaEdicao(maquina);
    setMaquinaSelecionada(maquina);
    setIsEditOpen(true);
  };

  const abrirModalExclusao = (maquina) => {
    setMaquinaSelecionada(maquina);
    setIsDeleteOpen(true);
  };

  //envios de edição e exclusão
  const handleEditar = async (e) => {
    e.preventDefault();
    const payload = new FormData();
    payload.append("nome", formData.nomeMaquina);
    // gi, adicione os outros appends iguais ao de criar ...

    try {
      await maquinaCrudService.editar(maquinaSelecionada.id, payload);
      setIsEditOpen(false);
      limparFormulario();
    } catch (erro) {
      console.error(erro);
    }
  };

  const handleExcluir = async () => {
    try {
      await maquinaCrudService.excluir(maquinaSelecionada.id);
      setIsDeleteOpen(false);
    } catch (erro) {
      console.error(erro);
    }
  };

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

          <Dialog open={isCreateOpen} onOpenChange={(open) => {
            setIsCreateOpen(open);
            if (!open) limparFormulario();
          }}>

            <DialogTrigger className="bg-secondary-foreground px-4 py-1 rounded-md flex items-center text-white text-xl font-semibold">
              <Plus className="mr-2" />
              Cadastrar
            </DialogTrigger>

            <DialogContent className="top-0 left-0 right-0 translate-x-0 translate-y-0 w-full max-w-none rounded-b-lg">
              <div className="flex items-center">
                <div className="bg-blue-900 flex items-center px-4 py-2 rounded-md">
                  <Plus className="mr-2 text-3xl text-white" />
                  <DialogTitle className="text-3xl text-white">Cadastrar Máquina</DialogTitle>
                </div>

              </div>
              <Separator className="m-2 bg-[#a6a6a6]" />

              <form onSubmit={handleSubmitPreparado} className="px-8 pb-8 pt-4 flex flex-col gap-6">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".jpg, .jpeg, .png, .webp, image/jpeg, image/png, image/webp"
                  className="hidden"
                />
                {/* div do upload clicavel */}
                <div
                  onClick={handleUploadClick}
                  className="border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center bg-white border-gray-300 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  {!arquivo ? (
                    <div className="flex flex-col items-center text-gray-500">
                      <Upload className="w-12 h-12 mb-2 text-gray-400" />
                      <span className="text-md font-medium">Clique aqui para fazer upload da imagem.</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center w-full">
                      {/*pré-visualização da Imagem */}
                      <img
                        src={arquivo.preview}
                        alt="Preview"
                        className="w-32 h-32 object-cover rounded-lg mb-2 border"
                      />
                      <div className="flex items-center bg-[#aebfdb] text-[#4a5f82] px-3 py-2 rounded-md w-full">
                        <File className="w-4 h-4 mr-2 shrink-0" />
                        <span className="text-sm truncate">{arquivo.nome}</span>
                      </div>
                    </div>
                  )}
                </div>


                <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-md text-cinza-escuro">Nome</label>
                    <input
                      id="nomeMaquina"
                      type="text"
                      placeholder=""
                      value={formData.nomeMaquina}
                      onChange={handleInputChange}
                      className="border rounded-md p-2.5 outline-none"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-md text-cinza-escuro">ID</label>
                    <input
                      id="idMaquina"
                      type="number"
                      value={formData.idMaquina}
                      onChange={handleInputChange}
                      className="border rounded-md p-2.5 outline-none"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-md text-cinza-escuro">Setor</label>
                    <select
                      id="setorMaquina"
                      value={formData.setorMaquina}
                      onChange={handleInputChange}
                      className="border rounded-md p-2.5 outline-none bg-white"
                    >
                      <option value="">Selecione...</option>
                      <option value="Engrenagens">Engrenagens</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-md text-cinza-escuro">Capacidade Normal</label>
                    <input
                      id="capacidadeNormalMaquina"
                      type="text"
                      value={formData.capacidadeNormalMaquina}
                      onChange={handleInputChange}
                      className="border rounded-md p-2.5 outline-none"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-md text-cinza-escuro">Tipo de Máquina</label>
                    <select
                      id="tipoMaquina"
                      value={formData.tipoMaquina}
                      onChange={handleInputChange}
                      className="border rounded-md p-2.5 outline-none bg-white"
                    >
                      <option value="">Selecione...</option>
                      <option value="Tipo A">Tipo A</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-md text-cinza-escuro">Data de Aquisição</label>
                    <input
                      id="dataAquisicaoMaquina"
                      type="date"
                      value={formData.dataAquisicaoMaquina}
                      onChange={handleInputChange}
                      className="border rounded-md p-2.5 outline-none"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-md text-cinza-escuro">Operador</label>
                    <select
                      id="operadorMaquina"
                      value={formData.operadorMaquina}
                      onChange={handleInputChange}
                      className="border rounded-md p-2.5 outline-none bg-white"
                    >
                      <option value="">Selecione...</option>
                      <option value="João">João</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-md text-cinza-escuro">Status</label>
                    <select
                      id="statusMaquina"
                      value={formData.statusMaquina}
                      onChange={handleInputChange}
                      className="border rounded-md p-2.5 outline-none bg-white"
                    >
                      <option value="">Selecione...</option>
                      <option value="Parada">Parada</option>
                      <option value="Produzindo">Produzindo</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-center mt-4">
                  <button type="submit" className="bg-[#002866] text-xl text-white font-semibold py-3 px-10 rounded-lg ">
                    Cadastrar
                  </button>
                </div>
              </form>
            </DialogContent>

          </Dialog>
        </div>
      </section>
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
      
 {/* LISTAGEM MAQUINAS      */}

      {/* Listagem */}
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
        <div className="px-8 mt-5 pb-10">
          {dadosExibidos.length === 0 ? (
            //mensagem quando não há dados correspondentes
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
                  <tr key={item.id} className="border-b hover:bg-gray-50">
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