"use client";

import { useState, useMemo } from "react";
import { useSetores } from "./hooks/useSetores";

const ITEMS_POR_PAGINA = 5; 

const OPCOES_ORDEM = [
  { label: "Ordem Alfabética",     fn: (a, b) => a.setor.localeCompare(b.setor) },
  
  // OEE
  { label: "OEE Crescente",        fn: (a, b) => a.oeeMedio - b.oeeMedio },
  { label: "OEE Decrescente",      fn: (a, b) => b.oeeMedio - a.oeeMedio },
  
  // Quantidade de Máquinas
  { label: "Qtd. Máquina Crescente", fn: (a, b) => a.qtdMaquinas - b.qtdMaquinas },
  { label: "Qtd. Máquina Decrescente", fn: (a, b) => b.qtdMaquinas - a.qtdMaquinas },
  
  // Quantidade de Operadores
  { label: "Qtd. Operadores Crescente", fn: (a, b) => a.qtdOperadores - b.qtdOperadores },
  { label: "Qtd. Operadores Decrescente", fn: (a, b) => b.qtdOperadores - a.qtdOperadores },
];

export function SetoresListaWidget() {
  const { data, loading, error } = useSetores();

  const [busca,         setBusca]         = useState("");
  const [ordemIdx,      setOrdemIdx]      = useState(0);
  const [pagina,        setPagina]        = useState(1);
  const [selecionados,  setSelecionados]  = useState(new Set());
  const [menuAberto,    setMenuAberto]    = useState(null);

  const filtrados = useMemo(() => {
    if (!data?.length) return [];
    const termo = busca.toLowerCase();
    return [...data]
      .filter(s =>
        s.setor.toLowerCase().includes(termo) ||
        s.gestor.toLowerCase().includes(termo)
      )
      .sort(OPCOES_ORDEM[ordemIdx].fn);
  }, [data, busca, ordemIdx]);

  const totalPaginas = Math.ceil(filtrados.length / ITEMS_POR_PAGINA);
  const paginaAtual  = filtrados.slice(
    (pagina - 1) * ITEMS_POR_PAGINA,
    pagina * ITEMS_POR_PAGINA
  );

  function toggleSelect(id) {
    setSelecionados(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function toggleTodos() {
    const ids = paginaAtual.map(s => s.id);
    const todosSelecionados = ids.every(id => selecionados.has(id));
    setSelecionados(prev => {
      const next = new Set(prev);
      if (todosSelecionados) ids.forEach(id => next.delete(id));
      else ids.forEach(id => next.add(id));
      return next;
    });
  }

  function mudarPagina(n) {
    setPagina(Math.max(1, Math.min(n, totalPaginas)));
    setMenuAberto(null);
  }

  if (loading) return <p className="p-6 text-gray-500">Carregando...</p>;
  if (error)   return <p className="p-6 text-red-500">Erro ao carregar dados.</p>;

  const todosSelecionados = paginaAtual.length > 0 &&
    paginaAtual.every(s => selecionados.has(s.id));

  return (
    <div className="w-full bg-transparent min-h-screen font-sans antialiased text-gray-700">
      
      {/* HEADER  */}
      <div className="px-6 py-6">
        <div className="flex items-center gap-4 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 whitespace-nowrap">
            Listagem de Setores
          </h2>
          <div className="h-[1px] w-full bg-gray-200 mt-2"></div>
        </div>

        {/* BUSCA E FILTROS */}
        <div className="flex flex-col gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Busque por setor ou gestor..."
              value={busca}
              onChange={e => { setBusca(e.target.value); setPagina(1); }}
              className="w-full h-12 pl-4 pr-12 rounded-lg bg-gray-100 border-none text-gray-600 placeholder:text-gray-400 focus:ring-1 focus:ring-gray-300 outline-none transition-all"
            />
            <svg className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400 font-medium tracking-tight">
              +{filtrados.length} setores encontrados
            </span>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Ordenar por</span>
                <div className="relative flex items-center border border-gray-200 rounded-md px-3 py-1.5 bg-white cursor-pointer hover:bg-gray-50 transition-colors">
                  <select
                    value={ordemIdx}
                    onChange={e => { setOrdemIdx(Number(e.target.value)); setPagina(1); }}
                    className="appearance-none bg-transparent pr-8 text-sm font-medium text-gray-800 outline-none cursor-pointer"
                  >
                    {OPCOES_ORDEM.map((o, i) => (
                      <option key={i} value={i}>{o.label}</option>
                    ))}
                  </select>
                  <svg className="absolute right-3 pointer-events-none text-gray-500" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <path d="M6 9l6 6 6-6"/>
                  </svg>
                </div>
              </div>

              <button className="h-9 px-4 rounded-md bg-[#101828] text-white text-sm font-semibold flex items-center gap-2 hover:bg-slate-800 transition-colors">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M4 6h16M7 12h10M11 18h2"/>
                </svg>
                Filtrar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* TABELA */}
      <div className="overflow-x-auto px-6">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/30">
              <th className="py-4 px-2 w-10">
                <input
                  type="checkbox"
                  checked={todosSelecionados}
                  onChange={toggleTodos}
                  className="w-4 h-4 rounded border-gray-300 accent-[#101828] cursor-pointer"
                />
              </th>
              <th className="py-4 px-2 text-sm font-bold text-gray-900 uppercase tracking-tight">Setor</th>
              <th className="py-4 px-2 text-sm font-bold text-gray-900 uppercase tracking-tight">Gestor</th>
              <th className="py-4 px-2 text-sm font-bold text-gray-900 uppercase tracking-tight text-center">OEE Médio</th>
              <th className="py-4 px-2 text-sm font-bold text-[#b45309] uppercase tracking-tight text-center">Qtd. de Máquinas</th>
              <th className="py-4 px-2 text-sm font-bold text-[#b45309] uppercase tracking-tight text-center">Qtd. de Operadores</th>
              <th className="py-4 px-2 text-sm font-bold text-gray-900 uppercase tracking-tight text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {paginaAtual.map((setor) => (
              <tr key={setor.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="py-4 px-2">
                  <input
                    type="checkbox"
                    checked={selecionados.has(setor.id)}
                    onChange={() => toggleSelect(setor.id)}
                    className="w-4 h-4 rounded border-gray-300 accent-[#101828] cursor-pointer"
                  />
                </td>
                <td className="py-4 px-2 text-sm font-semibold text-blue-900 underline decoration-blue-900/20 underline-offset-4 cursor-pointer hover:decoration-blue-900/60">
                  {setor.setor}
                </td>
                <td className="py-4 px-2 text-sm text-gray-700 font-medium">{setor.gestor}</td>
                <td className="py-4 px-2 text-sm text-gray-700 font-medium text-center">{setor.oeeMedio}%</td>
                <td className="py-4 px-2 text-sm text-gray-700 font-medium text-center">{setor.qtdMaquinas}</td>
                <td className="py-4 px-2 text-sm text-gray-700 font-medium text-center">{setor.qtdOperadores}</td>
                <td className="py-4 px-2 text-right relative">
                  <button
                    onClick={() => setMenuAberto(menuAberto === setor.id ? null : setor.id)}
                    className="p-1 text-gray-400 hover:text-gray-900"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/>
                    </svg>
                  </button>

                  {menuAberto === setor.id && (
                    <div className="absolute right-2 top-10 z-20 bg-white border border-gray-100 rounded-lg shadow-xl py-1 w-40 text-left">
                      {["Ver detalhes","Editar","Excluir"].map(acao => (
                        <button key={acao} className={`w-full px-4 py-2 text-xs font-medium hover:bg-gray-50 ${acao === 'Excluir' ? 'text-red-500' : 'text-gray-700'}`}>
                          {acao}
                        </button>
                      ))}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PAGINAÇÃO */}
      <div className="flex items-center justify-center gap-6 py-12">
        <button
          onClick={() => mudarPagina(pagina - 1)}
          disabled={pagina === 1}
          className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#0a1529] text-white disabled:opacity-20 hover:bg-slate-800 transition-all"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
        </button>

        <span className="text-xl font-medium text-gray-800">
          Página {pagina} de {totalPaginas}
        </span>

        <button
          onClick={() => mudarPagina(pagina + 1)}
          disabled={pagina === totalPaginas}
          className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#0a1529] text-white disabled:opacity-20 hover:bg-slate-800 transition-all"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </button>
      </div>
    </div>
  );
}