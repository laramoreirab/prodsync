"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { MaquinaStatusDonutWidget } from "@/features/maquinas/MaquinaStatusDonutWidget";
import { MaquinasPorSetorWidget } from "@/features/maquinas/MaquinasPorSetorWidget";
import { TempoMedioParadaWidget } from "@/features/maquinas/TempoMedioParadaWidget";
import { ProducaoDefeitosWidget } from "@/features/maquinas/ProducaoDefeitosWidget";
import { MaquinasPorTurnoWidget } from "@/features/maquinas/MaquinasPorTurnoWidget";
import { ProducaoTotalWidget } from "@/features/maquinas/ProducaoTotalWidget";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

import TableListagens from "@/components/table";
import { Badge } from "@/components/ui/badge";
import { DataUltimaParada } from "@/components/ui/dataUltimaParada";

import { Plus, Search, Loader2, EyeIcon, Pencil, Trash2 } from "lucide-react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import OrdenarDropdown from "@/components/ui/OrdenarDropdown";
import FilterDropdown from "@/components/ui/FilterDropdown";
import { useMaquinas } from '@/hooks/useMaquinas';
import FormCadastroMaquina from "@/components/ui/forms/maquinas/formCadastroMaquina";
import FormEdicaoMaquina from "@/components/ui/forms/maquinas/formEdicaoMaquina";
import FormExclusaoMaquina from "@/components/ui/forms/maquinas/formExclusaoMaquina";

const colunasMaquinas = [
  { id: 'nome', key: 'nome', label: 'Nome', className: 'w-1/8' },
  { id: 'id_maquina', key: 'id_maquina', label: 'ID', className: 'w-30 text-center justify-center' }, /* id da máquina */
  {
    id: 'status',
    key: 'status',
    label: 'Status',
    className: 'text-center justify-center',
    icone: (valor) => {
      const config = {
        "Produzindo": { variant: "produzindo" },
        "Setup": { variant: "setup" },
        "Parada": { variant: "parada" }
      };

      const estilo = config[valor] || { variant: "outline", className: "" };
      return (
        <Badge variant={estilo.variant} className={`whitespace-nowrap ${estilo.className}`}>
          {valor}
        </Badge>
      );
    }
  },
  { id: "oee_atual", key: "oee_atual", label: "OEE Atual", className: "w-45", },
  { id: "operador", key: "operador", label: "Operador", className: "w-1/7" },
];

const dadosEstaticos = [
  {
    id_maquina: "M-001",
    nome: "Injetora HAITIAN 120",
    status: "Produzindo",
    oee_atual: "85%",
    operador: "Carlos Silva"
  },
  {
    id_maquina: "M-002",
    nome: "Torno CNC Nardini",
    status: "Parada",
    oee_atual: "42%",
    operador: "Ana Oliveira"
  },
  {
    id_maquina: "M-003",
    nome: "Prensa Hidráulica 50T",
    status: "Setup",
    oee_atual: "12%",
    operador: "Marcos Souza"
  },
  {
    id_maquina: "M-004",
    nome: "Fresadora Universal",
    status: "Produzindo",
    oee_atual: "78%",
    operador: "Ricardo Santos"
  },
  {
    id_maquina: "M-005",
    nome: "Solda Robotizada Kuka",
    status: "Produzindo",
    oee_atual: "92%",
    operador: "Sistemas Auto"
  },
  {
    id_maquina: "M-006",
    nome: "Corte a Laser Fiber",
    status: "Parada",
    oee_atual: "0%",
    operador: "Lucas Lima"
  },
  {
    id_maquina: "M-007",
    nome: "Dobradeira CNC",
    status: "Setup",
    oee_atual: "25%",
    operador: "Beatriz Costa"
  },
  {
    id_maquina: "M-008",
    nome: "Extrusora de Perfil",
    status: "Produzindo",
    oee_atual: "88%",
    operador: "João Pereira"
  },
  {
    id_maquina: "M-009",
    nome: "Retífica Plana",
    status: "Produzindo",
    oee_atual: "74%",
    operador: "Fernando Dias"
  },
  {
    id_maquina: "M-010",
    nome: "Torno Automático A25",
    status: "Parada",
    oee_atual: "15%",
    operador: "Mariana Gomes"
  },
  {
    id_maquina: "M-011",
    nome: "Centro de Usinagem VMC",
    status: "Produzindo",
    oee_atual: "91%",
    operador: "Roberto Alves"
  },
  {
    id_maquina: "M-012",
    nome: "Compressor de Ar Atlas",
    status: "Produzindo",
    oee_atual: "99%",
    operador: "Manutenção Geral"
  },
  {
    id_maquina: "M-013",
    nome: "Ponte Rolante 10T",
    status: "Setup",
    oee_atual: "30%",
    operador: "Felipe Ramos"
  },
  {
    id_maquina: "M-014",
    nome: "Forno de Têmpera",
    status: "Parada",
    oee_atual: "0%",
    operador: "Patrícia Melo"
  },
  {
    id_maquina: "M-015",
    nome: "Envasadora Automática",
    status: "Produzindo",
    oee_atual: "82%",
    operador: "Gabriel Torres"
  }
];



export default function MaquinasGestor() {
  const [setorId, setSetorId] = useState(null);
  const { maquinas, loading, refresh, excluirMaquina } = useMaquinas();
  const [busca, setBusca] = useState("");
  const [dados, setDados] = useState([]);

  // 1. Pega SetorID do Token
  useEffect(() => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const payload = JSON.parse(atob(token.split(".")[1]));
      if (payload?.id_setor) setSetorId(payload.id_setor);
    } catch (e) { console.error("Erro no token", e); }
  }, []);

  // 2. Sincroniza dados da API
  useEffect(() => {
    setDados(maquinas);
  }, [maquinas]);

  // --- Lógica de Ordenação e Filtro ---
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

  const dadosExibidos = dados.filter((maq) => {
    const termo = busca.toLowerCase();
    return maq.nome.toLowerCase().includes(termo) || maq.id_maquina?.toString().includes(termo);
  });

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="animate-spin text-blue-900 w-12 h-12" />
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
        <div className="flex flex-col gap-6">
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border rounded-xl p-6 shadow-sm">
            <MaquinaStatusDonutWidget setorId={setorId} />
          </div>
          <div className="bg-white border rounded-xl p-6 shadow-sm">
            <MaquinasPorSetorWidget setorId={setorId} />
          </div>
          <div className="bg-white border rounded-xl p-6 shadow-sm">
            <TempoMedioParadaWidget setorId={setorId} />
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border rounded-xl p-6 shadow-sm">
            <ProducaoDefeitosWidget setorId={setorId} />
          </div>
          <div className="bg-white border rounded-xl p-6 shadow-sm">
            <MaquinasPorTurnoWidget setorId={setorId} />
          </div>
        </section>

        <section className="bg-white border rounded-xl p-6 shadow-sm">
          <ProducaoTotalWidget setorId={setorId} />
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

          <div className="row_ord_fil_cont flex items-center justify-between mt-3">
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

          {/* Tabela */}
          <div className="flex flex-col flex-1 items-center w-full mt-4">
            {dadosExibidos.length > 0 ? (

              <TableListagens
                /* Dados e colunas a depender da página [no momento está estático definido em um json, posteriormente será um get]  */
                data={dadosExibidos} columns={colunasMaquinas}
                acoesDropdown={(maquina) => (
                  <>

                    <DropdownMenuItem asChild className="cursor-pointer">
                      <Link href={`maquinas/${maquina.id_maquina}`}>
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
                        <FormEdicaoMaquina maquinaId={maquina.id_maquina} onEdicaoSucesso={refresh} />
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
                        <FormExclusaoMaquina
                          maquinaId={maquina.id_maquina}
                          onExcluir={excluirMaquina}
                        />
                      </DialogContent>
                    </Dialog>

                  </>
                )}

              />
            ) : (
              //caso não encontre nada correspondente
              <div className="flex flex-col items-center justify-center p-8 text-gray-500">
                <Search className="w-12 h-12 mb-4 text-gray-300" />
                <h2 className="text-xl font-semibold">Nenhuma máquina encontrada</h2>
                <p>Não encontramos nenhuma máquina com o filtro ou busca.</p>
              </div>
            )}
          </div>
        </section>

      </div>
    </main >
  );
}