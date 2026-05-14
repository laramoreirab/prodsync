"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { EyeIcon, Loader2, Pencil, Plus, Search, Trash2 } from "lucide-react";

import TableListagens from "@/components/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import FilterDropdown from "@/components/ui/FilterDropdown";
import OrdenarDropdown from "@/components/ui/OrdenarDropdown";
import FormCadastroMaquina from "@/components/ui/forms/maquinas/formCadastroMaquina";
import FormEdicaoMaquina from "@/components/ui/forms/maquinas/formEdicaoMaquina";
import FormExclusaoMaquina from "@/components/ui/forms/maquinas/formExclusaoMaquina";
import { useMaquinas } from "@/hooks/useMaquinas";

import { MaquinaStatusDonutWidget } from "@/features/maquinas/MaquinaStatusDonutWidget";
import { MaquinasPorSetorWidget } from "@/features/maquinas/MaquinasPorSetorWidget";
import { TempoMedioParadaWidget } from "@/features/maquinas/TempoMedioParadaWidget";
import { ProducaoDefeitosWidget } from "@/features/maquinas/ProducaoDefeitosWidget";
import { MaquinasPorTurnoWidget } from "@/features/maquinas/MaquinasPorTurnoWidget";
import { ProducaoTotalWidget } from "@/features/maquinas/ProducaoTotalWidget";

const colunasMaquinas = [
  { id: "nome", key: "nome", label: "Nome", className: "w-1/8" },
  { id: "id_maquina", key: "id_maquina", label: "ID", className: "w-30 text-center justify-center" },
  {
    id: "status",
    key: "status",
    label: "Status",
    className: "text-center justify-center",
    icone: (valor) => {
      const config = {
        Produzindo: { variant: "produzindo" },
        Setup: { variant: "setup" },
        Parada: { variant: "parada" },
      };
      const estilo = config[valor] || { variant: "outline", className: "" };

      return (
        <Badge variant={estilo.variant} className={`whitespace-nowrap ${estilo.className}`}>
          {valor || "-"}
        </Badge>
      );
    },
  },
  { id: "oee_atual", key: "oee_atual", label: "OEE Atual", className: "w-45" },
  { id: "operador", key: "operador", label: "Operador", className: "w-1/7" },
];

const maquinasFilter = [
  { id: "status", label: "Status", type: "checkbox", options: ["Produzindo", "Setup", "Parada", "Manutencao", "Aguardando"] },
];

const opcoesOrdenacao = [
  { label: "Ordem Alfabetica", value: "nome" },
  { label: "ID Crescente", value: "id_asc" },
  { label: "ID Decrescente", value: "id_desc" },
  { label: "Status", value: "status" },
];

function getSetorIdFromToken() {
  try {
    const token = localStorage.getItem("token");
    if (!token) return null;
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload?.id_setor ?? payload?.idSetor ?? null;
  } catch {
    return null;
  }
}

function normalizarMaquina(maquina) {
  return {
    ...maquina,
    status: maquina.status_atual || maquina.status || "",
    operador: maquina.operador?.nome || maquina.operador || "Sem operador",
    oee_atual: maquina.oee_atual || "-",
  };
}

export default function MaquinasGestor() {
  const [setorId, setSetorId] = useState(null);
  const { maquinas, loading, refresh, excluirMaquina } = useMaquinas();
  const [busca, setBusca] = useState("");
  const [dados, setDados] = useState([]);

  useEffect(() => {
    setSetorId(getSetorIdFromToken());
  }, []);

  const maquinasDoSetor = useMemo(() => {
    return (maquinas || [])
      .filter((maquina) => !setorId || String(maquina.id_setor) === String(setorId))
      .map(normalizarMaquina);
  }, [maquinas, setorId]);

  useEffect(() => {
    setDados(maquinasDoSetor);
  }, [maquinasDoSetor]);

  const handleSort = (criterio) => {
    const ordenado = [...dados].sort((a, b) => {
      if (criterio === "nome") return a.nome.localeCompare(b.nome);
      if (criterio === "id_asc") return Number(a.id_maquina) - Number(b.id_maquina);
      if (criterio === "id_desc") return Number(b.id_maquina) - Number(a.id_maquina);
      if (criterio === "status") return String(a.status).localeCompare(String(b.status));
      return 0;
    });
    setDados(ordenado);
  };

  const aplicarFiltros = (filtrosSelecionados) => {
    let filtrados = [...maquinasDoSetor];
    if (filtrosSelecionados.status?.length > 0) {
      filtrados = filtrados.filter((maquina) => filtrosSelecionados.status.includes(maquina.status));
    }
    setDados(filtrados);
  };

  const dadosExibidos = dados.filter((maquina) => {
    const termo = busca.toLowerCase();
    return maquina.nome?.toLowerCase().includes(termo) || String(maquina.id_maquina).includes(termo);
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
            Maquinas
          </h1>
          <Dialog>
            <DialogTrigger className="bg-secondary-foreground px-4 py-1 rounded-md flex items-center text-white text-xl font-semibold cursor-pointer">
              <Plus className="mr-2" />
              Cadastrar
            </DialogTrigger>
            <DialogContent>
              <FormCadastroMaquina onCadastroSucesso={refresh} />
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex flex-col gap-6 mt-6">
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

        <section id="listagem_maquinas">
          <div className="flex items-center gap-5 mt-8">
            <h2 className="text-4xl font-semibold">Inventario de Maquinas</h2>
            <hr className="bg-black flex-1 h-1" />
          </div>

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
            <p>{dadosExibidos.length} maquinas encontradas</p>
            <div className="flex items-center gap-4">
              <OrdenarDropdown label="Ordenar por" options={opcoesOrdenacao} onSortChange={handleSort} />
              <FilterDropdown filtersConfig={maquinasFilter} onApply={aplicarFiltros} />
            </div>
          </div>

          <div className="flex flex-col flex-1 items-center w-full mt-4">
            {dadosExibidos.length > 0 ? (
              <TableListagens
                data={dadosExibidos}
                columns={colunasMaquinas}
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
                        <FormExclusaoMaquina maquinaId={maquina.id_maquina} onExcluir={excluirMaquina} />
                      </DialogContent>
                    </Dialog>
                  </>
                )}
              />
            ) : (
              <div className="flex flex-col items-center justify-center p-8 text-gray-500">
                <Search className="w-12 h-12 mb-4 text-gray-300" />
                <h2 className="text-xl font-semibold">Nenhuma maquina encontrada</h2>
                <p>Nao encontramos nenhuma maquina com o filtro ou busca.</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
