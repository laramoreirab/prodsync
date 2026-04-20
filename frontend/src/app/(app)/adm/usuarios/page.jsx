"use client"

import Header from "@/components/ui/topbar";
import TableListagens from "@/components/shadcn-studio/table/table";
import SearchBar from "@/components/ui/searchBar";
import React, { useState } from 'react';
import { useUsuarios } from "@/hooks/useUsuarios";
import { usuarioService } from "@/services/usuariosCrudService";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus, Search, Info, File, Upload, ChevronDown } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import FilterDropdown from "@/components/ui/filterDropdown";
import OrdenarDropdown from "@/components/ui/ordenarDropdown";

const usuariosFilter = [
  { id: "setor", label: "Setor", type: "checkbox", options: ["Brocas", "Roscas"] },
  { id: "funcao", label: "Função", type: "checkbox", options: ["Operador", "Gestor"] },
  { id: "turno", label: "Turno", type: "checkbox", options: ["Manhã", "Tarde", "Noite"] },
];

//dados dos usuarios
const dadosOriginais = [
  { id: 1, nome: 'Ana Silva', setor: 'Roscas', funcao: 'Operador', turno: 'Manhã' },
  { id: 2, nome: 'Carlos Souza', setor: 'Brocas', funcao: 'Gestor', turno: 'Tarde' },
  { id: 3, nome: 'Bruno Costa', setor: 'Roscas', funcao: 'Operador', turno: 'Noite' },
  { id: 4, nome: 'Bia Gonçalves', setor: 'Brocas', funcao: 'Gestor', turno: 'Tarde' }
];

export default function Usuarios() {
  const [dados, setDados] = useState(dadosOriginais);
  const [busca, setBusca] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoteModalOpen, setIsLoteModalOpen] = useState(false);

  const {
    formData,
    fotoPerfil,
    arquivoLote,
    usuarioEditandoId,
    fileInputLoteRef,
    fileInputFotoRef,
    handleInputChange,
    handleFotoChange,
    handleLoteChange,
    preencherParaEdicao,
    limparFormularios,
  } = useUsuarios();

  const handleSubmitIndividual = async (e) => {
    e.preventDefault();
    const payload = new FormData();
    Object.keys(formData).forEach(key => payload.append(key, formData[key]));
    if (fotoPerfil?.raw) payload.append("foto", fotoPerfil.raw);

    try {
      if (usuarioEditandoId) {
        await usuarioService.editar(usuarioEditandoId, payload);
        alert("Usuário atualizado com sucesso!");
      } else {
        await usuarioService.cadastrarIndividual(payload);
        alert("Usuário criado com sucesso!");
      }
      limparFormularios();
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
      alert("Erro ao salvar.");
    }
  };

  const handleSubmitLote = async (e) => {
    e.preventDefault();
    if (!arquivoLote) return alert("Selecione um arquivo CSV!");
    
    const payloadLote = new FormData();
    payloadLote.append("file", arquivoLote.raw); 

    try {
      await usuarioService.cadastrarEmLote(payloadLote);
      alert("Lote enviado com sucesso!");
      limparFormularios();
      setIsLoteModalOpen(false);
    } catch (error) {
      console.error(error);
      alert("Erro ao enviar lote.");
    }
  };

  //lógica de ordenação
  const handleSort = (criterio) => {
    const dadosCopiados = [...dados];

    dadosCopiados.sort((a, b) => {
      if (criterio === 'nome') return a.nome.localeCompare(b.nome);
      if (criterio === 'id_asc') return a.id - b.id;
      if (criterio === 'id_desc') return b.id - a.id;
      if (criterio === 'turno') return a.turno.localeCompare(b.turno);
      if (criterio === 'funcao') return a.funcao.localeCompare(b.funcao);
      if (criterio === 'setor') return a.setor.localeCompare(b.setor);
      return 0;
    });

    setDados(dadosCopiados);
  };

  //recebendo os filtros do dropdown e atualizando a tabela
  const aplicarFiltros = (filtrosSelecionados) => {
    let dadosFiltrados = [...dadosOriginais];

    //filtros para setor
    if (filtrosSelecionados.setor && filtrosSelecionados.setor.length > 0) {
      dadosFiltrados = dadosFiltrados.filter(user =>
        filtrosSelecionados.setor.includes(user.setor)
      );
    }

    //filtro para funçao do user
    if (filtrosSelecionados.funcao && filtrosSelecionados.funcao.length > 0) {
      dadosFiltrados = dadosFiltrados.filter(user =>
        filtrosSelecionados.funcao.includes(user.funcao)
      );
    }

    //filtro para turno
    if (filtrosSelecionados.turno && filtrosSelecionados.turno.length > 0) {
      dadosFiltrados = dadosFiltrados.filter(user =>
        filtrosSelecionados.turno.includes(user.turno)
      );
    }

    setDados(dadosFiltrados);
  };

  const opcoesOrdenacao = [
    { label: 'Ordem Alfabética', value: 'nome' },
    { label: 'ID Crescente', value: 'id_asc' },
    { label: 'ID Decrescente', value: 'id_desc' },
    { label: 'Turno', value: 'turno' },
    { label: 'Função', value: 'funcao' },
    { label: 'Setor', value: 'setor' }
  ];

  const colunasUsuarios = [
    { key: 'nome', label: 'Nome' },
    { key: 'id', label: 'ID', className: 'w-20' },
    { key: 'setor', label: 'Setor' },
    { key: 'funcao', label: 'Função' },
    { key: 'turno', label: 'Turno' },
  ];

  //filtra os dados atuais (filtrados e ordenados) pelo termo de busca
  const dadosExibidos = dados.filter((user) => {
    const termo = busca.toLowerCase();
    return (
      user.nome.toLowerCase().includes(termo) ||
      user.id.toString().includes(termo)
    );
  });

  const labelStyle = "text-gray-600 text-sm font-medium mb-1.5 block";
  const inputStyle = "w-full border border-gray-200 rounded-md p-3 text-sm outline-none focus:ring-2 focus:ring-blue-900/10 transition-all";

  return (
    <main className="min-h-screen bg-[url('/bg_app.svg')] bg-cover bg-center bg-no-repeat flex flex-col">
      <Header />

      <section className="graphs_cadastro">
        {/* Título da tela e do botão que leva ao modal de cadastro do usuário */}
        <div className="flex justify-between p-8">
          <div className="title_tela">
            <h1 className="underline decoration-secondary-foreground underline-offset-9 decoration-5 text-4xl font-semibold">
              Usuários
            </h1>
          </div>

          {/* Modal de Cadastrar Usuário*/}
          <Dialog open={isModalOpen} onOpenChange={(open) => {
            setIsModalOpen(open);
            if (!open) limparFormularios();
          }}>
            <DialogTrigger 
              onClick={() => { limparFormularios(); setIsModalOpen(true); }}
              className="bg-secondary-foreground px-4 py-1 rounded-md flex items-center text-white text-xl font-semibold"
            >
              <Plus className="mr-2" />
              Cadastrar
            </DialogTrigger>

            <DialogContent className="top-0 left-0 right-0 translate-x-0 translate-y-0 w-full max-w-none rounded-b-lg max-h-screen overflow-y-auto">
              <div className="title_modal flex items-center">
                <div className="bg-blue-900 flex items-center px-4 py-2 rounded-md">
                  <Plus className="mr-2 text-3xl text-white" />
                  <DialogTitle className="text-3xl text-white">
                    {usuarioEditandoId ? "Editar Usuário" : "Criar Usuário"}
                  </DialogTitle>
                </div>
              </div>
              <Separator className="m-2 bg-[#a6a6a6]" />
              
              <form onSubmit={handleSubmitIndividual} className="px-8 pb-8 pt-4 flex flex-col gap-6">
                
                <div className="flex justify-end">
                  <Dialog open={isLoteModalOpen} onOpenChange={setIsLoteModalOpen}>
                    <DialogTrigger className="bg-secondary-foreground px-4 py-2 rounded-md flex items-center text-white text-xl font-semibold">
                      <Plus className="mr-2" />
                      Criar em Lote
                    </DialogTrigger>
                    
                    <DialogContent>
                      <div className="flex items-center">
                        <div className="bg-blue-900 flex items-center px-4 py-2 rounded-md">
                          <Plus className="mr-2 text-3xl text-white" />
                          <DialogTitle className="text-3xl text-white">Criar Usuários em Lote</DialogTitle>
                        </div>
                      </div>
                      <Separator className="m-2 bg-[#a6a6a6]" />
                      
                      <div className="px-8 pb-8 pt-4 flex flex-col gap-6">
                        <input
                          type="file"
                          ref={fileInputLoteRef}
                          onChange={handleLoteChange}
                          accept=".csv"
                          className="hidden"
                        />
                        
                        {/* div do upload clicavel */}
                        <div
                          onClick={() => fileInputLoteRef.current?.click()}
                          className="border-2 border-dashed rounded-xl p-7 flex flex-col items-center justify-center bg-white border-gray-300 hover:bg-gray-50 cursor-pointer transition-colors"
                        >
                          {!arquivoLote ? (
                            <div className="flex flex-col items-center text-gray-500">
                              <Upload className="w-12 h-12 mb-2 text-gray-400" />
                              <span className="text-md font-medium">Clique aqui para fazer upload do arquivo CSV.</span>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center w-full">
                              <div className="flex items-center bg-[#aebfdb] text-[#4a5f82] px-3 py-2 rounded-md w-full">
                                <File className="w-4 h-4 mr-2 shrink-0" />
                                <span className="text-sm truncate">{arquivoLote.nome}</span>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center">
                          <Info className="text-[#7c7c81] mr-2"/>
                          <p className="text-[#7c7c81]">O arquivo deve estar em .CSV e cada campo necessita estar corretamente separado por vírgulas. </p>
                        </div>

                        <div className="flex justify-center mt-4">
                          <button type="button" onClick={handleSubmitLote} className="bg-[#002866] text-xl text-white font-semibold py-3 px-10 rounded-lg">
                            Criar em Lote
                          </button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                <input
                  type="file"
                  ref={fileInputFotoRef}
                  onChange={handleFotoChange}
                  accept=".jpg, .jpeg, .png, .webp, image/jpeg, image/png, image/webp"
                  className="hidden"
                />

                {/* div do upload clicavel */}
                <div
                  onClick={() => fileInputFotoRef.current?.click()}
                  className="border-2 border-dashed rounded-xl p-7 flex flex-col items-center justify-center bg-white border-gray-300 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  {!fotoPerfil ? (
                    <div className="flex flex-col items-center text-gray-500">
                      <Upload className="w-12 h-12 mb-2 text-gray-400" />
                      <span className="text-md font-medium">Clique aqui para fazer upload da imagem.</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center w-full">
                      {/*pré-visualização da imagem */}
                      <img
                        src={fotoPerfil.preview}
                        alt="Preview"
                        className="w-32 h-32 object-cover rounded-lg mb-2 border"
                      />
                      <div className="flex items-center bg-[#aebfdb] text-[#4a5f82] px-3 py-2 rounded-md w-full">
                        <File className="w-4 h-4 mr-2 shrink-0" />
                        <span className="text-sm truncate">{fotoPerfil.nome}</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-5">
                  <div>
                    <label className={labelStyle}>Nome</label>
                    <input id="nomeUser" value={formData.nomeUser} onChange={handleInputChange} type="text" className={inputStyle} required />
                  </div>
                  <div>
                    <label className={labelStyle}>CPF</label>
                    <input id="cpfUser" value={formData.cpfUser} onChange={handleInputChange} type="text" className={inputStyle} required />
                  </div>
                  <div>
                    <label className={labelStyle}>E-mail</label>
                    <input id="emailUser" value={formData.emailUser} onChange={handleInputChange} type="email" className={inputStyle} required />
                  </div>

                  {/* Select personalizado com ícone */}
                  <div className="relative">
                    <label className={labelStyle}>Setor</label>
                    <select id="setorUser" value={formData.setorUser} onChange={handleInputChange} className={`${inputStyle} appearance-none pr-10 bg-white`} required>
                      <option value="">Selecione...</option>
                      <option value="Roscas">Roscas</option>
                      <option value="Brocas">Brocas</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-9.5 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <div className="relative">
                    <label className={labelStyle}>Função</label>
                    <select
                      id="funcaoUser"
                      className={`${inputStyle} appearance-none pr-10 bg-white`}
                      value={formData.funcaoUser}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Selecione...</option>
                      <option value="Operador">Operador</option>
                      <option value="Gestor">Gestor</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-9.5 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
                  <div className="relative">
                    <label className={labelStyle}>Turno</label>
                    <select id="turnoUser" value={formData.turnoUser} onChange={handleInputChange} className={`${inputStyle} appearance-none pr-10 bg-white`} required>
                      <option value="">Selecione...</option>
                      <option value="Manhã">Manhã</option>
                      <option value="Tarde">Tarde</option>
                      <option value="Noite">Noite</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-9.5 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Máquina a Gerenciar só aparece se função = operador */}
                {formData.funcaoUser === "Operador" && (
                  <div className="relative pt-1">
                    <label className={labelStyle}>Máquina a Gerenciar</label>
                    <select id="maquinaUser" value={formData.maquinaUser} onChange={handleInputChange} className={`${inputStyle} appearance-none pr-10 bg-white`} required>
                      <option value="">Selecione...</option>
                      <option value="M1">Máquina 1</option>
                      <option value="M2">Máquina 2</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-9.5 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
                )}

                <div className="flex justify-center mt-4">
                  <button type="submit" className="bg-[#002866] text-xl text-white font-semibold py-3 px-10 rounded-lg">
                    {usuarioEditandoId ? "Salvar Edição" : "Criar"}
                  </button>
                </div>
              </form>
            </DialogContent>
          </Dialog>

        </div>
      </section>

      {/* Listagem */}
      <section id="listagem_usuarios">
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
              placeholder="Busque por nome ou id..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
            <button className="outline-none cursor-pointer mr-2"><Search /></button>
          </div>
        </div>

        {/* Linha de quantidade total de usuarios e filtrar e ordenar funcional */}
        <div className="row_ord_fil_cont flex items-center justify-between px-8 mt-3">
          <p>{dadosExibidos.length} usuários encontrados</p>

          <div className="flex gap-4 items-center">
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

        <div className="flex flex-col flex-1 items-center w-full mt-4">
          {dadosExibidos.length > 0 ? (
            /* data={dadosExibidos} ao invés do array fixo */
            <TableListagens data={dadosExibidos} columns={colunasUsuarios} />
          ) : (
            //caso não encontre nada correspondente
            <div className="flex flex-col items-center justify-center p-8 text-gray-500">
              <Search className="w-12 h-12 mb-4 text-gray-300" />
              <h2 className="text-xl font-semibold">Nenhum usuário encontrado</h2>
              <p>Não encontramos nenhum resultado para "{busca}".</p>
            </div>
          )}
        </div>

      </section>
    </main >
  );
}