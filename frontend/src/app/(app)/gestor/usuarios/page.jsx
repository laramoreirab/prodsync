"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { EyeIcon, Loader2, Pencil, Plus, Search, Trash2 } from "lucide-react";

import TableListagens from "@/components/table";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import FilterDropdown from "@/components/ui/FilterDropdown";
import OrdenarDropdown from "@/components/ui/OrdenarDropdown";
import FormCadastroOperadorGestor from "@/components/ui/forms/usuarios/formCadastroOperadorGestor";
import FormEdicaoOperadorGestor from "@/components/ui/forms/usuarios/formEdicaoOperadorGestor";
import FormExclusaoUsuario from "@/components/ui/forms/usuarios/formExclusaoUsuario";
import { useUsuarios } from "@/hooks/useUsuarios";

import { QtdUsuariosWidget } from "@/features/usuarios/QtdUsuariosWidget";
import { TurnosOperadoresWidget } from "@/features/usuarios/TurnosOperadoresWidget";
import { TopOperadoresWidget } from "@/features/usuarios/TopOperadoresWidget";
import { TempoSessaoWidget } from "@/features/usuarios/TempoSessaoWidget";
import { RotatividadeWidget } from "@/features/usuarios/RotatividadeWidget";
import { ProducaoMediaUsuarioSetorWidget } from "@/features/usuarios/ProducaoMediaUsuarioSetorWidget";
import { UsuarioTaxaRefugoWidget } from "@/features/usuarios/UsuarioTaxaRefugoWidget";

const turnoLabel = { "1": "Manha", "2": "Tarde", "3": "Noite" };

const colunasUsuarios = [
  { id: "nome", key: "nome", label: "Nome", className: "w-1/5" },
  { id: "id", key: "id", label: "ID", className: "w-40" },
  { id: "maquina", key: "maquina", label: "Maquina", className: "pl-15" },
  {
    id: "id_turno",
    key: "id_turno",
    label: "Turno",
    icone: (valor) => turnoLabel[String(valor)] || valor || "-",
  },
];

export default function UsuariosGestor() {
  const { usuarios, loading, refresh } = useUsuarios();
  const [setorId, setSetorId] = useState(null);
  const [dados, setDados] = useState([]);
  const [busca, setBusca] = useState("");

  useEffect(() => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const payload = JSON.parse(atob(token.split(".")[1]));
      if (payload?.id_setor) setSetorId(payload.id_setor);
    } catch {
      setSetorId(null);
    }
  }, []);

  const operadoresDoSetor = useMemo(() => {
    return (usuarios || []).filter((usuario) => {
      const mesmoSetor = !setorId || String(usuario.id_setor) === String(setorId);
      return mesmoSetor && usuario.funcao === "Operador";
    });
  }, [usuarios, setorId]);

  useEffect(() => {
    setDados(operadoresDoSetor);
  }, [operadoresDoSetor]);

  const handleSort = (criterio) => {
    const ordenado = [...dados].sort((a, b) => {
      if (criterio === "nome") return a.nome.localeCompare(b.nome);
      if (criterio === "id_asc") return Number(a.id) - Number(b.id);
      if (criterio === "id_desc") return Number(b.id) - Number(a.id);
      if (criterio === "turno") return String(a.id_turno || "").localeCompare(String(b.id_turno || ""));
      return 0;
    });
    setDados(ordenado);
  };

  const aplicarFiltros = (filtrosSelecionados) => {
    let filtrados = [...operadoresDoSetor];

    if (filtrosSelecionados.id_turno?.length > 0) {
      filtrados = filtrados.filter((user) =>
        filtrosSelecionados.id_turno.includes(turnoLabel[String(user.id_turno)])
      );
    }

    setDados(filtrados);
  };

  const dadosExibidos = dados.filter((user) => {
    const termo = busca.toLowerCase();
    return user.nome?.toLowerCase().includes(termo) || String(user.id).includes(termo);
  });

  if (loading) {
    return (
      <main className="min-h-screen bg-[url('/bg_app.svg')] bg-cover bg-fixed bg-center bg-no-repeat flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-blue-900" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[url('/bg_app.svg')] bg-cover bg-fixed bg-center bg-no-repeat flex flex-col">
      <div className="px-8">
        <div className="py-4 flex justify-between items-center">
          <h1 className="underline decoration-secondary-foreground underline-offset-9 decoration-5 text-4xl font-semibold">
            Usuarios
          </h1>
          <Dialog>
            <DialogTrigger className="bg-secondary-foreground px-4 py-1 rounded-md flex items-center text-white text-xl font-semibold cursor-pointer">
              <Plus className="mr-2" />
              Cadastrar
            </DialogTrigger>
            <DialogContent className="rounded-lg top-0 left-0 right-0 translate-x-0 translate-y-0 w-full max-w-none max-h-screen overflow-y-auto">
              <FormCadastroOperadorGestor onCadastroSucesso={refresh} />
            </DialogContent>
          </Dialog>
        </div>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm min-h-[300px]">
            <QtdUsuariosWidget />
          </div>
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm min-h-[300px]">
            <TurnosOperadoresWidget setorId={setorId} />
          </div>
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm min-h-[300px]">
            <TopOperadoresWidget setorId={setorId} />
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <TempoSessaoWidget setorId={setorId} />
          </div>
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <RotatividadeWidget setorId={setorId} />
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <ProducaoMediaUsuarioSetorWidget setorId={setorId} />
          </div>
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <UsuarioTaxaRefugoWidget setorId={setorId} />
          </div>
        </section>

        <section>
          <div className="flex items-center py-6 gap-5">
            <h2 className="text-4xl font-semibold">Listagem de Operadores</h2>
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
            <p>{dadosExibidos.length} operadores encontrados</p>
            <div className="flex items-center gap-4">
              <OrdenarDropdown
                label="Ordenar por"
                options={[
                  { label: "Ordem Alfabetica", value: "nome" },
                  { label: "ID Crescente", value: "id_asc" },
                  { label: "ID Decrescente", value: "id_desc" },
                  { label: "Turno", value: "turno" },
                ]}
                onSortChange={handleSort}
              />
              <FilterDropdown
                filtersConfig={[
                  { id: "id_turno", label: "Turno", type: "checkbox", options: ["Manha", "Tarde", "Noite"] },
                ]}
                onApply={aplicarFiltros}
              />
            </div>
          </div>

          <div className="flex flex-col flex-1 items-center w-full mt-4">
            {dadosExibidos.length > 0 ? (
              <TableListagens
                data={dadosExibidos}
                columns={colunasUsuarios}
                acoesDropdown={(user) => (
                  <>
                    <DropdownMenuItem asChild className="cursor-pointer">
                      <Link href={`usuarios/${user.id}`}>
                        <EyeIcon className="mr-2 h-10 w-10" />
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
                      <DialogContent className="rounded-lg top-0 left-0 right-0 translate-x-0 translate-y-0 w-full max-w-none max-h-screen overflow-y-auto">
                        <FormEdicaoOperadorGestor operadorId={user.id} onEdicaoSucesso={refresh} />
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
                        <FormExclusaoUsuario usuarioId={user.id} onExclusaoSucesso={refresh} />
                      </DialogContent>
                    </Dialog>
                  </>
                )}
              />
            ) : (
              <div className="flex flex-col items-center justify-center p-8 text-gray-500">
                <Search className="w-12 h-12 mb-4 text-gray-300" />
                <h2 className="text-xl font-semibold">Nenhum operador encontrado</h2>
                <p>Nao encontramos nenhum operador com a busca ou filtro.</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
