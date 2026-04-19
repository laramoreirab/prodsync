"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { useSetores } from "./hooks/useSetores";

const ITEMS_POR_PAGINA = 9;
const OPCOES_ORDEM = [
  { label: "Ordem Alfabética", fn: (a, b) => a.setor.localeCompare(b.setor) },
  
  { label: "OEE Crescente",    fn: (a, b) => Number(a.oeeMedio) - Number(b.oeeMedio) },
  { label: "OEE Decrescente",   fn: (a, b) => Number(b.oeeMedio) - Number(a.oeeMedio) },
  
  { label: "Qtd. Máquina Crescente", fn: (a, b) => Number(a.qtdMaquinas) - Number(b.qtdMaquinas) },
  { label: "Qtd. Máquina Decrescente", fn: (a, b) => Number(b.qtdMaquinas) - Number(a.qtdMaquinas) },
  
  { label: "Qtd. Operadores Crescente", fn: (a, b) => Number(a.qtdOperadores) - Number(b.qtdOperadores) },
  { label: "Qtd. Operadores Decrescente", fn: (a, b) => Number(b.qtdOperadores) - Number(a.qtdOperadores) },
];

function badgeOEE(valor) {
  if (valor >= 85) return { bg: "#e6f4ea", color: "#1a7f37" };
  if (valor >= 60) return { bg: "#fff8e1", color: "#b45309" };
  return { bg: "#fde8e8", color: "#b91c1c" };
}

const FILTROS_INICIAIS = {
  setores: [],
  oeeMin: "", oeeMax: "",
  maqMin: "", maqMax: "",
  opMin:  "", opMax:  "",
};

function sanitize(val) {
  if (val === "") return "";
  return Number(val) < 0 ? "0" : String(val);
}

function FiltroSecao({ titulo, aberta, onToggle, children }) {
  return (
    <div className="border-b border-gray-100 last:border-0">
      <div className="flex items-center justify-between px-4 py-3">
        <span className="text-sm font-semibold text-slate-800">{titulo}</span>
        <button
          onClick={onToggle}
          className="w-5 h-5 flex items-center justify-center text-gray-400 hover:text-slate-700 transition-colors text-lg leading-none"
        >
          {aberta ? "−" : "+"}
        </button>
      </div>
      {aberta && <div className="px-4 pb-4">{children}</div>}
    </div>
  );
}

function RangeInputs({ min, max, onMinChange, onMaxChange, suffix = "" }) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {[["Mínimo", min, onMinChange], ["Máximo", max, onMaxChange]].map(([label, val, onChange]) => (
        <div key={label}>
          <p className="text-xs text-gray-400 mb-1">{label}</p>
          <div className="relative">
            <input
              type="number"
              min="0"
              value={val}
              onChange={e => onChange(sanitize(e.target.value))}
              className="w-full h-8 rounded-lg border border-gray-200 px-2 pr-6 text-sm outline-none focus:border-[#004aad] focus:ring-2 focus:ring-[#004aad]/10"
            />
            {suffix && (
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-400 pointer-events-none">
                {suffix}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export function SetoresListaWidget() {
  const { data, loading, error } = useSetores();

  const [busca,        setBusca]        = useState("");
  const [ordemIdx,     setOrdemIdx]     = useState(0);
  const [pagina,       setPagina]       = useState(1);
  const [selecionados, setSelecionados] = useState(new Set());
  const [menuAberto,   setMenuAberto]   = useState(null);

  const [painelAberto,  setPainelAberto]  = useState(false);
  const [secaoAberta,   setSecaoAberta]   = useState(null); // ← só uma por vez
  const [filtrosRasc,   setFiltrosRasc]   = useState(FILTROS_INICIAIS);
  const [filtrosAtivos, setFiltrosAtivos] = useState(FILTROS_INICIAIS);

  const painelRef = useRef(null);

  useEffect(() => {
    function handler(e) {
      if (painelRef.current && !painelRef.current.contains(e.target))
        setPainelAberto(false);
    }
    if (painelAberto) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [painelAberto]);

  function abrirPainel() {
    setFiltrosRasc(filtrosAtivos);
    setSecaoAberta(null);
    setPainelAberto(v => !v);
  }

  // Alterna: mesma seção fecha, outra fecha a anterior e abre a nova
  function toggleSecao(nome) {
    setSecaoAberta(prev => (prev === nome ? null : nome));
  }

  function toggleSetorFiltro(setor) {
    setFiltrosRasc(prev => {
      const set = new Set(prev.setores);
      set.has(setor) ? set.delete(setor) : set.add(setor);
      return { ...prev, setores: [...set] };
    });
  }

  function aplicarFiltros() {
    setFiltrosAtivos(filtrosRasc);
    setPagina(1);
    setPainelAberto(false);
  }

  function removerTag(campo) {
    const limpar = prev => {
      const next = { ...prev };
      if (campo === "setores") next.setores = [];
      if (campo === "oee") { next.oeeMin = ""; next.oeeMax = ""; }
      if (campo === "maq") { next.maqMin = ""; next.maqMax = ""; }
      if (campo === "op")  { next.opMin  = ""; next.opMax  = ""; }
      return next;
    };
    setFiltrosRasc(limpar);
    setFiltrosAtivos(limpar);
    setPagina(1);
  }

  const tagsRasc = useMemo(() => {
    const t = [];
    const f = filtrosRasc;
    if (f.setores.length)
      f.setores.forEach(s => t.push({ key: `setor-${s}`, label: s, campo: "setores" }));
    if (f.oeeMin !== "" || f.oeeMax !== "")
      t.push({ key: "oee", label: `OEE Médio até ${f.oeeMax || 100}%`, campo: "oee" });
    if (f.maqMin !== "" || f.maqMax !== "")
      t.push({ key: "maq", label: `Máquinas: ${f.maqMin || 0} - ${f.maqMax || "∞"}`, campo: "maq" });
    if (f.opMin !== "" || f.opMax !== "")
      t.push({ key: "op",  label: `Operadores: ${f.opMin || 0} - ${f.opMax || "∞"}`, campo: "op" });
    return t;
  }, [filtrosRasc]);

  const tagsAtivas = useMemo(() => {
    const f = filtrosAtivos;
    let n = 0;
    if (f.setores.length) n++;
    if (f.oeeMin !== "" || f.oeeMax !== "") n++;
    if (f.maqMin !== "" || f.maqMax !== "") n++;
    if (f.opMin  !== "" || f.opMax  !== "") n++;
    return n;
  }, [filtrosAtivos]);

  const nomesSetores = useMemo(() => {
    if (!data?.length) return [];
    return [...new Set(data.map(s => s.setor))].sort();
  }, [data]);

const filtrados = useMemo(() => {
  if (!data?.length) return [];
  
  const termo = busca.toLowerCase();
  const f = filtrosAtivos;

  const resultado = data.filter(s => {
    if (termo && !s.setor.toLowerCase().includes(termo) && !s.gestor.toLowerCase().includes(termo)) return false;
    if (f.setores.length && !f.setores.includes(s.setor)) return false;
    if (f.oeeMin !== "" && s.oeeMedio < Number(f.oeeMin)) return false;
    if (f.oeeMax !== "" && s.oeeMedio > Number(f.oeeMax)) return false;
    if (f.maqMin !== "" && s.qtdMaquinas < Number(f.maqMin)) return false;
    if (f.maqMax !== "" && s.qtdMaquinas > Number(f.maqMax)) return false;
    if (f.opMin !== "" && s.qtdOperadores < Number(f.opMin)) return false;
    if (f.opMax !== "" && s.qtdOperadores > Number(f.opMax)) return false;
    return true;
  });

 return resultado.sort(OPCOES_ORDEM[ordemIdx].fn);

}, [data, busca, ordemIdx, filtrosAtivos]); 

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
    const ids   = paginaAtual.map(s => s.id);
    const todos = ids.every(id => selecionados.has(id));
    setSelecionados(prev => {
      const next = new Set(prev);
      if (todos) ids.forEach(id => next.delete(id));
      else ids.forEach(id => next.add(id));
      return next;
    });
  }

  if (loading) return <p className="text-sm text-muted-foreground p-6">Carregando setores...</p>;
  if (error)   return <p className="text-sm text-destructive p-6">Erro ao carregar setores.</p>;

  const todosSelecionados =
    paginaAtual.length > 0 && paginaAtual.every(s => selecionados.has(s.id));

  return (
    <div>

      {/* HEADER */}
      <div className="px-6 pt-6 pb-4 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Listagem de Setores</h2>

        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="relative w-full sm:w-72">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              type="text"
              placeholder="Busque por setor ou gestor..."
              value={busca}
              onChange={e => { setBusca(e.target.value); setPagina(1); }}
              className="w-full h-9 rounded-lg border border-gray-200 bg-gray-50 pl-9 pr-3 text-sm outline-none focus:border-[#004aad] focus:ring-2 focus:ring-[#004aad]/10 placeholder:text-gray-400"
            />
          </div>

          <div className="flex gap-2 items-center flex-wrap">
            <span className="text-xs text-gray-400 whitespace-nowrap">
              +{filtrados.length} setores encontrados
            </span>
            <div className="flex items-center gap-1.5 border border-gray-200 rounded-lg px-2 h-9 bg-white">
              <span className="text-xs text-gray-500 whitespace-nowrap">Ordenar por</span>
              <select
                value={ordemIdx}
                onChange={e => { setOrdemIdx(Number(e.target.value)); setPagina(1); }}
                className="text-xs font-medium text-slate-800 bg-transparent outline-none cursor-pointer"
              >
                {OPCOES_ORDEM.map((o, i) => (
                  <option key={i} value={i}>{o.label}</option>
                ))}
              </select>
            </div>

            <button
              onClick={abrirPainel}
              className={`h-9 px-3 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors ${
                painelAberto || tagsAtivas > 0
                  ? "bg-[#004aad] text-white"
                  : "bg-[#00357a] text-white hover:bg-[#004aad]"
              }`}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="4" y1="6" x2="20" y2="6"/>
                <line x1="8" y1="12" x2="16" y2="12"/>
                <line x1="11" y1="18" x2="13" y2="18"/>
              </svg>
              Filtrar
              {tagsAtivas > 0 && (
                <span className="bg-white text-[#004aad] rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-bold">
                  {tagsAtivas}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* PAINEL DE FILTROS  */}
      {painelAberto && (
        <div
          ref={painelRef}
          className="absolute top-[88px] right-4 z-40 w-64 bg-white border border-gray-200 rounded-2xl shadow-2xl flex flex-col"
          style={{ maxHeight: "calc(100% - 100px)", overflowY: "auto" }}
        >
          <FiltroSecao titulo="Setor" aberta={secaoAberta === "setor"} onToggle={() => toggleSecao("setor")}>
            <div className="flex flex-col gap-2">
              {nomesSetores.map(nome => (
                <label key={nome} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filtrosRasc.setores.includes(nome)}
                    onChange={() => toggleSetorFiltro(nome)}
                    className="rounded border-gray-300 accent-[#00357a] cursor-pointer"
                  />
                  <span className="text-sm text-slate-700">{nome}</span>
                </label>
              ))}
            </div>
          </FiltroSecao>

          <FiltroSecao titulo="OEE Médio" aberta={secaoAberta === "oee"} onToggle={() => toggleSecao("oee")}>
            <RangeInputs
              min={filtrosRasc.oeeMin} max={filtrosRasc.oeeMax}
              onMinChange={v => setFiltrosRasc(p => ({ ...p, oeeMin: v }))}
              onMaxChange={v => setFiltrosRasc(p => ({ ...p, oeeMax: v }))}
              suffix="%"
            />
          </FiltroSecao>

          <FiltroSecao titulo="Qtd. de Máquinas" aberta={secaoAberta === "maq"} onToggle={() => toggleSecao("maq")}>
            <RangeInputs
              min={filtrosRasc.maqMin} max={filtrosRasc.maqMax}
              onMinChange={v => setFiltrosRasc(p => ({ ...p, maqMin: v }))}
              onMaxChange={v => setFiltrosRasc(p => ({ ...p, maqMax: v }))}
            />
          </FiltroSecao>

          <FiltroSecao titulo="Qtd. de Operadores" aberta={secaoAberta === "op"} onToggle={() => toggleSecao("op")}>
            <RangeInputs
              min={filtrosRasc.opMin} max={filtrosRasc.opMax}
              onMinChange={v => setFiltrosRasc(p => ({ ...p, opMin: v }))}
              onMaxChange={v => setFiltrosRasc(p => ({ ...p, opMax: v }))}
            />
          </FiltroSecao>

          {tagsRasc.length > 0 && (
            <div className="px-4 pt-3 pb-2 flex flex-wrap gap-1.5">
              {tagsRasc.map(tag => (
                <span key={tag.key}
                  className="inline-flex items-center gap-1 bg-slate-100 text-slate-600 text-xs px-2 py-0.5 rounded-full">
                  {tag.label}
                  <button onClick={() => removerTag(tag.campo)} className="hover:text-red-500 transition-colors ml-0.5">
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}

          <div className="p-3 border-t border-gray-100 mt-auto">
            <button
              onClick={aplicarFiltros}
              className="w-full h-10 rounded-xl bg-[#00357a] hover:bg-[#004aad] text-white text-sm font-medium transition-colors"
            >
              Aplicar Filtros
            </button>
          </div>
        </div>
      )}

      {/* TABELA */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="w-10 px-4 py-3">
                <input type="checkbox" checked={todosSelecionados} onChange={toggleTodos}
                  className="rounded border-gray-300 accent-[#00357a] cursor-pointer"/>
              </th>
              {["Setor","Gestor","OEE Médio","Qtd. de Máquinas","Qtd. de Operadores","Ações"].map(col => (
                <th key={col} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 tracking-wide">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginaAtual.map((setor, idx) => {
              const badge = badgeOEE(setor.oeeMedio);
              const sel   = selecionados.has(setor.id);
              return (
                <tr key={setor.id}
                  className={`border-b border-gray-50 transition-colors ${
                    sel ? "bg-blue-50/50" : idx % 2 === 0 ? "bg-white" : "bg-gray-50/30"
                  } hover:bg-blue-50/30`}
                >
                  <td className="px-4 py-3">
                    <input type="checkbox" checked={sel} onChange={() => toggleSelect(setor.id)}
                      className="rounded border-gray-300 accent-[#00357a] cursor-pointer"/>
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-800">{setor.setor}</td>
                  <td className="px-4 py-3 text-gray-600">{setor.gestor}</td>
                  <td className="px-4 py-3">
                    <span className="inline-block px-2 py-0.5 rounded-full text-xs font-semibold"
                      style={{ background: badge.bg, color: badge.color }}>
                      {setor.oeeMedio}%
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{setor.qtdMaquinas}</td>
                  <td className="px-4 py-3 text-gray-600">{setor.qtdOperadores}</td>
                  <td className="px-4 py-3 relative">
                    <button
                      onClick={() => setMenuAberto(menuAberto === setor.id ? null : setor.id)}
                      className="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <circle cx="12" cy="5"  r="1.5"/>
                        <circle cx="12" cy="12" r="1.5"/>
                        <circle cx="12" cy="19" r="1.5"/>
                      </svg>
                    </button>
                    {menuAberto === setor.id && (
                      <div className="absolute right-6 top-8 z-20 bg-white border border-gray-200 rounded-xl shadow-lg py-1 w-36">
                        {["Ver detalhes","Editar","Excluir"].map(acao => (
                          <button key={acao} onClick={() => setMenuAberto(null)}
                            className={`w-full text-left px-4 py-2 text-xs hover:bg-gray-50 transition-colors ${
                              acao === "Excluir" ? "text-red-500 hover:bg-red-50" : "text-slate-700"
                            }`}>
                            {acao}
                          </button>
                        ))}
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
            {paginaAtual.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-sm text-gray-400">
                  Nenhum setor encontrado para os filtros aplicados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINAÇÃO */}
      {totalPaginas > 1 && (
        <div className="flex items-center justify-center gap-3 py-4 border-t border-gray-100">
          <button onClick={() => setPagina(p => Math.max(1, p - 1))} disabled={pagina === 1}
            className="w-8 h-8 rounded-full flex items-center justify-center border border-gray-200 text-gray-500 disabled:opacity-30 hover:bg-gray-50 transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M15 18l-6-6 6-6"/>
            </svg>
          </button>
          <span className="text-sm text-gray-600">
            Página <strong className="text-slate-800">{pagina}</strong> de{" "}
            <strong className="text-slate-800">{totalPaginas}</strong>
          </span>
          <button onClick={() => setPagina(p => Math.min(totalPaginas, p + 1))} disabled={pagina === totalPaginas}
            className="w-8 h-8 rounded-full flex items-center justify-center border border-gray-200 text-gray-500 disabled:opacity-30 hover:bg-gray-50 transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}