"use client"

import { useState, useEffect } from 'react';

import TableListagens from "@/components/table";
import DataTableWithPaginationDemo from '@/components/shadcn-studio/data-table/data-table-11';

import { useUsuarios } from "@/hooks/useUsuarios";
import { usuarioService } from "@/services/usuariosCrudService";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus, Search, Info, File, Upload, ChevronDown, Trash2, TriangleAlert } from "lucide-react";
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

//Widgets dashboard
import { QtdUsuariosWidget } from "@/features/usuarios/QtdUsuariosWidget";
import { QtdUsuariosPorSetorWidget } from "@/features/usuarios/QtdUsuariosPorSetorWidget";
import { TopOperadoresWidget } from "@/features/usuarios/TopOperadoresWidget";
import { TempoSessaoWidget } from "@/features/usuarios/TempoSessaoWidget";
import { RotatividadeWidget } from "@/features/usuarios/RotatividadeWidget";
import { SobrecargaSetorWidget } from "@/features/usuarios/SobrecargaSetorWidget";
import { ProducaoMediaSetorWidget } from "@/features/usuarios/ProducaoMediaSetorWidget";
import FormCadastroUsuario from '@/components/ui/forms/usuarios/formCadastroUsuario';
import FormEdicaoUsuario from '@/components/ui/forms/usuarios/formEdicaoUsuario';
import FormExclusaoUsuario from '@/components/ui/forms/usuarios/formExclusaoUsuario';



export default function Usuarios() {
  const [dados, setDados] = useState([]);
  const [busca, setBusca] = useState("");

  /* API para teste da tabela */
  useEffect(() => {
    async function buscarUsuariosFalsos() {
      try {
        // 1. Puxando os dados da API de teste
        const res = await fetch('https://dummyjson.com/users');

        if (!res.ok) throw new Error('Falha ao buscar usuários');

        const json = await res.json();

        // 2. A DummyJSON devolve os usuários dentro de uma propriedade chamada "users"
        const dadosDaApi = json.users;

        // 3. Vamos "traduzir" os dados em inglês para o formato da sua tabela
        const usuariosFormatados = dadosDaApi.map((user) => ({
          id: user.id,
          nome: `${user.firstName} ${user.lastName}`, // Junta nome e sobrenome
          setor: user.company.department,             // Usa o departamento da API como "Setor"
          funcao: user.company.title,                 // Usa o cargo da API como "Função"

          // Como a API não tem "turno", vamos inventar um de forma aleatória só para testar
          turno: ['Manhã', 'Tarde', 'Noite'][Math.floor(Math.random() * 3)]
        }));

        // 4. Salva no estado! A tabela vai renderizar 30 usuários reais imediatamente.
        setDados(usuariosFormatados);

      } catch (error) {
        console.error("Erro na integração:", error);
      }
    }

    buscarUsuariosFalsos();
  }, []);


  /* Fetch da listagem de usuarios OFICIAL
    useEffect(() => {
      async function buscarUsuarios() {
        try {
          const res = await fetch(''); // Endpoint de usuários exemplo: 'https://localhost:8080/adm/usuarios'
  
          if (!res.ok) throw new Error('Falha ao buscar usuários');
  
          const json = await res.json();
  
          // Lista de Usuarios
          setDados(json);
        } catch (error) {
          console.error("Erro:", error);
        }
      }
  
      buscarUsuarios();
    }, []); */

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

  // const handleSubmitIndividual = async (e) => {
  //   e.preventDefault();
  //   const payload = new FormData();
  //   Object.keys(formData).forEach(key => payload.append(key, formData[key]));
  //   if (fotoPerfil?.raw) payload.append("foto", fotoPerfil.raw);

  //   try {
  //     if (usuarioEditandoId) {
  //       await usuarioService.editar(usuarioEditandoId, payload);
  //       alert("Usuário atualizado com sucesso!");
  //     } else {
  //       await usuarioService.cadastrarIndividual(payload);
  //       alert("Usuário criado com sucesso!");
  //     }
  //     limparFormularios();
  //     setIsModalOpen(false);
  //   } catch (error) {
  //     console.error(error);
  //     alert("Erro ao salvar.");
  //   }
  // };

  // const handleSubmitLote = async (e) => {
  //   e.preventDefault();
  //   if (!arquivoLote) return alert("Selecione um arquivo CSV!");

  //   const payloadLote = new FormData();
  //   payloadLote.append("file", arquivoLote.raw);

  //   try {
  //     await usuarioService.cadastrarEmLote(payloadLote);
  //     alert("Lote enviado com sucesso!");
  //     limparFormularios();
  //     setIsLoteModalOpen(false);
  //   } catch (error) {
  //     console.error(error);
  //     alert("Erro ao enviar lote.");
  //   }
  // };

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
    { id: 'nome', key: 'nome', label: 'Nome', className: 'w-1/4' },
    { id: 'id', key: 'id', label: 'ID', className: 'w-40' },
    { id: 'setor', key: 'setor', label: 'Setor', className: 'w-2/9' },
    { id: 'funcao', key: 'funcao', label: 'Função' },
    { id: 'turno', key: 'turno', label: 'Turno' },
  ];

  //filtra os dados atuais (filtrados e ordenados) pelo termo de busca
  const dadosExibidos = dados.filter((user) => {
    const termo = busca.toLowerCase();
    return (
      user.nome.toLowerCase().includes(termo) ||
      user.id.toString().includes(termo)
    );
  });


  return (
    <main className="min-h-screen bg-[url('/bg_app.svg')] bg-cover bg-fixed bg-center bg-no-repeat flex flex-col">
      {/* SEÇÃO 1: CHarts*/}
      <section className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <div className=" bg-white border rounded-xl p-4">
            <QtdUsuariosWidget />
          </div>

          <div className=" bg-white border rounded-xl p-4">
            <QtdUsuariosPorSetorWidget />
          </div>

          <div className=" bg-white border rounded-xl p-4">
            <TopOperadoresWidget />
          </div>

        </div>
      </section>

      {/* SEÇÃO 2: Charts */}
      <section className=" p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <div className=" bg-white border rounded-xl p-6">
            <TempoSessaoWidget />
          </div>

          <div className=" bg-white border rounded-xl p-4">
            <RotatividadeWidget />
          </div>

        </div>
      </section>

      {/* SEÇÃO 3: Charts */}
      <section className=" p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <div className="border  bg-white rounded-xl p-4">
            <SobrecargaSetorWidget />
          </div>

          <div className="border bg-white rounded-xl p-4">
            <ProducaoMediaSetorWidget />
          </div>

        </div>
      </section>

      <section className="graphs_cadastro">
        {/* Título da tela e do botão que leva ao modal de cadastro do usuário */}
        <div className="flex justify-between p-8">
          <div className="title_tela">
            <h1 className="underline decoration-secondary-foreground underline-offset-9 decoration-5 text-4xl font-semibold">
              Usuários
            </h1>
          </div>

          {/* Modal de Cadastrar Usuário*/}
          <Dialog>
            <DialogTrigger
              className="bg-secondary-foreground px-4 py-1 rounded-md flex items-center text-white text-xl font-semibold cursor-pointer"
            >
              <Plus className="mr-2" />
              Cadastrar
            </DialogTrigger>

            <DialogContent className="top-0 left-0 right-0 translate-x-0 translate-y-0 w-full max-w-none rounded-b-lg max-h-screen overflow-y-auto">
              <FormCadastroUsuario />
            </DialogContent>
          </Dialog>

        </div>

        {/* Gráficos */}
      </section>
      {/* SEÇÃO 1: CHarts*/}
      <section className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <div className="border rounded-xl p-4">
            <QtdUsuariosWidget />
          </div>

          <div className="border rounded-xl p-4">
            <QtdUsuariosPorSetorWidget />
          </div>

          <div className="border rounded-xl p-4">
            <TopOperadoresWidget />
          </div>

        </div>
      </section>

      {/* SEÇÃO 2: Charts */}
      <section className=" p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <div className="border rounded-xl p-6">
            <TempoSessaoWidget />
          </div>

          <div className="border rounded-xl p-4">
            <RotatividadeWidget />
          </div>

        </div>
      </section>

      {/* SEÇÃO 3: Charts */}
      <section className=" p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <div className="border rounded-xl p-4">
            <SobrecargaSetorWidget />
          </div>

          <div className="border rounded-xl p-4">
            <ProducaoMediaSetorWidget />
          </div>

        </div>
      </section>



      {/* Listagem */}
      <section id="listagem_usuarios" className='px-8'>
        <div className="flex items-center py  -8 gap-5">
          <h1 className="text-4xl w-[125] font-semibold">Listagem de Usuários</h1>
          <hr className="bg-black flex-1 h-1" />
        </div>

        {/* Busca */}
        <div className="flex searchbar">
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
        <div className="row_ord_fil_cont flex items-center justify-between mt-3">
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

            <TableListagens
              /* Dados e colunas a depender da página [no momento está estático definido em um json, posteriormente será um get]  */
              data={dadosExibidos} columns={colunasUsuarios}

              // 1. Para a ação "ver detalhes" Url com base na linha clicada
              viewLink={(row) => `/adm/usuarios/${row.id}`}

              // 2.  modais de Editar e Excluir para a tabela renderizar - falta integrar!!!
              dialogs={{
                edit: (row) => (
                  <>
                    <DialogContent>
                      <FormEdicaoUsuario />
                    </DialogContent>
                  </>
                ),
                delete: (row) => (
                  <>
                    <DialogContent>
                      <FormExclusaoUsuario/>
                    </DialogContent>
                  </>
                )
              }}
            />
          ) : (
            //caso não encontre nada correspondente
            <div className="flex flex-col items-center justify-center p-8 text-gray-500">
              <Search className="w-12 h-12 mb-4 text-gray-300" />
              <h2 className="text-xl font-semibold">Nenhum usuário encontrado</h2>
              <p>Não encontramos nenhum resultado para "{busca}".</p>
            </div>
          )}
        </div>

        <DataTableWithPaginationDemo />

      </section>
    </main >
  );
}
