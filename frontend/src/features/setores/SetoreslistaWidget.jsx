"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { useSetores } from "./hooks/useSetores";
import Ic_Lupa from "@/assets/icons/ic_lupa";
import Ic_Filter from "@/assets/icons/ic_filter";

const ITEMS_POR_PAGINA = 8;
const OPCOES_ORDEM = [
  { label: "Ordem Alfabética", fn: (a, b) => a.setor.localeCompare(b.setor) },
  { label: "OEE Crescente", fn: (a, b) => Number(a.oeeMedio) - Number(b.oeeMedio) },
  { label: "OEE Decrescente", fn: (a, b) => Number(b.oeeMedio) - Number(a.oeeMedio) },
  { label: "Qtd. Máquina Crescente", fn: (a, b) => Number(a.qtdMaquinas) - Number(b.qtdMaquinas) },
  { label: "Qtd. Máquina Decrescente", fn: (a, b) => Number(b.qtdMaquinas) - Number(a.qtdMaquinas) },
  { label: "Qtd. Operadores Crescente", fn: (a, b) => Number(a.qtdOperadores) - Number(b.qtdOperadores) },
  { label: "Qtd. Operadores Decrescente", fn: (a, b) => Number(b.qtdOperadores) - Number(a.qtdOperadores) },
];

const FILTROS_INICIAIS = {
  setores: [],
  oeeMin: "", oeeMax: "",
  maqMin: "", maqMax: "",
  opMin: "", opMax: "",
};

// --- Funções Auxiliares de Lógica ---
function badgeOEE(valor) {
  // EXCELENTE (>= 85%)
  if (valor >= 85) return { bg: "#eff6ff", color: "#60a5fa" };

  // ATENÇÃO (60% - 84%)
  if (valor >= 60) return { bg: "#dbeafe", color: "#2563eb" };

  // CRÍTICO (< 60%)
  return { bg: "#4b73df", color: "#ffffff" };
}

function sanitize(val) {
  if (val === "") return "";
  return Number(val) < 0 ? "0" : String(val);
}

// --- Subcomponentes de Layout ---
function FiltroSecao({ titulo, aberta, onToggle, children }) {
  return (
    <div className="border-b border-gray-100 last:border-0">
      <div className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors" onClick={onToggle}>
        <span className="text-sm font-semibold text-slate-800">{titulo}</span>
        <span className="text-gray-400 text-lg">{aberta ? "−" : "+"}</span>
      </div>
      {aberta && <div className="px-4 pb-4 animate-in fade-in duration-200">{children}</div>}
    </div>
  );
}

function RangeInputs({ min, max, onMinChange, onMaxChange, suffix = "" }) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {[["Mínimo", min, onMinChange], ["Máximo", max, onMaxChange]].map(([label, val, onChange]) => (
        <div key={label}>
          <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-1">{label}</p>
          <div className="relative">
            <input
              type="number"
              value={val}
              onChange={e => onChange(sanitize(e.target.value))}
              className="w-full h-8 rounded border border-gray-200 px-2 pr-6 text-sm outline-none focus:border-[#1a2b4b] transition-all"
            />
            {suffix && <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-400">{suffix}</span>}
          </div>
        </div>
      ))}
    </div>
  );
}

export function SetoresListaWidget() {
  const { data, loading, error } = useSetores();

  // Estados de Lógica
  const [busca, setBusca] = useState("");
  const [ordemIdx, setOrdemIdx] = useState(0);
  const [pagina, setPagina] = useState(1);
  const [selecionados, setSelecionados] = useState(new Set());
  const [menuAberto, setMenuAberto] = useState(null);
  const [painelAberto, setPainelAberto] = useState(false);
  const [secaoAberta, setSecaoAberta] = useState(null);
  const [filtrosRasc, setFiltrosRasc] = useState(FILTROS_INICIAIS);
  const [filtrosAtivos, setFiltrosAtivos] = useState(FILTROS_INICIAIS);

  const painelRef = useRef(null);
  const menuRef = useRef(null);

  // Fechar menu de ações ao clicar fora
  useEffect(() => {
    function handler(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuAberto(null);
      }
    }
    if (menuAberto) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [menuAberto]);

  // Fechar painel ao clicar fora
  useEffect(() => {
    function handler(e) {
      if (painelRef.current && !painelRef.current.contains(e.target)) setPainelAberto(false);
    }
    if (painelAberto) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [painelAberto]);

  // --- Memos de Lógica ---
  const nomesSetores = useMemo(() => {
    if (!data?.length) return [];
    return [...new Set(data.map(s => s.setor))].sort();
  }, [data]);

  const filtrados = useMemo(() => {
    if (!data?.length) return [];
    const termo = busca.toLowerCase();
    const f = filtrosAtivos;

    return data.filter(s => {
      if (termo && !s.setor.toLowerCase().includes(termo) && !s.gestor.toLowerCase().includes(termo)) return false;
      if (f.setores.length && !f.setores.includes(s.setor)) return false;
      if (f.oeeMin !== "" && s.oeeMedio < Number(f.oeeMin)) return false;
      if (f.oeeMax !== "" && s.oeeMedio > Number(f.oeeMax)) return false;
      if (f.maqMin !== "" && s.qtdMaquinas < Number(f.maqMin)) return false;
      if (f.maqMax !== "" && s.qtdMaquinas > Number(f.maqMax)) return false;
      if (f.opMin !== "" && s.qtdOperadores < Number(f.opMin)) return false;
      if (f.opMax !== "" && s.qtdOperadores > Number(f.opMax)) return false;
      return true;
    }).sort(OPCOES_ORDEM[ordemIdx].fn);
  }, [data, busca, ordemIdx, filtrosAtivos]);

  const totalPaginas = Math.ceil(filtrados.length / ITEMS_POR_PAGINA);
  const paginaAtual = filtrados.slice((pagina - 1) * ITEMS_POR_PAGINA, pagina * ITEMS_POR_PAGINA);
  const todosSelecionados = paginaAtual.length > 0 && paginaAtual.every(s => selecionados.has(s.id));

  const tagsAtivasCount = useMemo(() => {
    const f = filtrosAtivos;
    let n = 0;
    if (f.setores.length) n++;
    if (f.oeeMin !== "" || f.oeeMax !== "") n++;
    if (f.maqMin !== "" || f.maqMax !== "") n++;
    if (f.opMin !== "" || f.opMax !== "") n++;
    return n;
  }, [filtrosAtivos]);

  // --- Handlers ---
  const toggleSelect = (id) => {
    setSelecionados(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleTodos = () => {
    const ids = paginaAtual.map(s => s.id);
    setSelecionados(prev => {
      const next = new Set(prev);
      todosSelecionados ? ids.forEach(id => next.delete(id)) : ids.forEach(id => next.add(id));
      return next;
    });
  };

  if (loading) return <p className="p-8 text-sm text-gray-400 animate-pulse">Carregando setores...</p>;
  if (error) return <p className="p-8 text-sm text-red-500">Erro ao carregar dados.</p>;

  return (
    <div className="relative">

      {/* HEADER */}
      <div className="px-6 py-5">
        <div className="flex items-center gap-4 mb-6">
          <h2 className="text-2xl font-semibold text-black whitespace-nowrap">Listagem de Setores</h2>
          <div className="h-[2px] w-full bg-gray-400 mt-1" />
        </div>

        {/* BARRA DE BUSCA E FILTROS  */}
        <div className="space-y-4">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Busque por setor ou gestor..."
              value={busca}
              onChange={e => { setBusca(e.target.value); setPagina(1); }}
              className="w-full h-11 rounded-xl border-none bg-gray-100 pl-4 pr-12 text-sm outline-none focus:ring-2 focus:ring-slate-200 transition-all"
            />
            <Ic_Lupa className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-sm text-gray-400 font-medium">
              +{filtrados.length} setores encontrados
            </span>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="flex items-center gap-2 bg-gray-50 px-3 py-1 rounded-lg border border-gray-100">
                <span className="text-xs text-gray-400 font-medium whitespace-nowrap">Ordenar por</span>
                <select
                  value={ordemIdx}
                  onChange={e => { setOrdemIdx(Number(e.target.value)); setPagina(1); }}
                  className="bg-transparent text-sm font-medium text-slate-700 outline-none cursor-pointer"
                >
                  {OPCOES_ORDEM.map((o, i) => <option key={i} value={i}>{o.label}</option>)}
                </select>
              </div>

              <button
                onClick={() => { setFiltrosRasc(filtrosAtivos); setPainelAberto(!painelAberto); }}
                className={`h-10 px-5 rounded-lg text-sm font-medium flex items-center gap-2 transition-all ${painelAberto || tagsAtivasCount > 0 ? "bg-[#212e4b] text-white" : "bg-slate-800 text-white hover:bg-[var(--secondary-foreground)]"
                  }`}
              >
                <Ic_Filter className="w-4 h-4 text-white" />
                Filtrar
                {tagsAtivasCount > 0 && (
                  <span className="bg-white text-[#1a2b4b] rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold shadow-sm">
                    {tagsAtivasCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* PAINEL DE FILTROS */}
      {painelAberto && (
        <div ref={painelRef} className="absolute top-44 right-6 z-50 w-72 bg-white border border-gray-200 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-top-2 duration-200">
          <div className="max-h-[400px] overflow-y-auto">
            <FiltroSecao titulo="Setor" aberta={secaoAberta === "setor"} onToggle={() => setSecaoAberta(secaoAberta === "setor" ? null : "setor")}>
              <div className="grid grid-cols-1 gap-2 mt-1">
                {nomesSetores.map(nome => (
                  <label key={nome} className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={filtrosRasc.setores.includes(nome)}
                      onChange={() => {
                        const set = new Set(filtrosRasc.setores);
                        set.has(nome) ? set.delete(nome) : set.add(nome);
                        setFiltrosRasc({ ...filtrosRasc, setores: [...set] });
                      }}
                      className="w-4 h-4 rounded border-gray-300 accent-[#1a2b4b]"
                    />
                    <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">{nome}</span>
                  </label>
                ))}
              </div>
            </FiltroSecao>

            <FiltroSecao titulo="OEE Médio (%)" aberta={secaoAberta === "oee"} onToggle={() => setSecaoAberta(secaoAberta === "oee" ? null : "oee")}>
              <RangeInputs
                min={filtrosRasc.oeeMin} max={filtrosRasc.oeeMax} suffix="%"
                onMinChange={v => setFiltrosRasc({ ...filtrosRasc, oeeMin: v })}
                onMaxChange={v => setFiltrosRasc({ ...filtrosRasc, oeeMax: v })}
              />
            </FiltroSecao>

            <FiltroSecao titulo="Máquinas" aberta={secaoAberta === "maq"} onToggle={() => setSecaoAberta(secaoAberta === "maq" ? null : "maq")}>
              <RangeInputs
                min={filtrosRasc.maqMin} max={filtrosRasc.maqMax}
                onMinChange={v => setFiltrosRasc({ ...filtrosRasc, maqMin: v })}
                onMaxChange={v => setFiltrosRasc({ ...filtrosRasc, maqMax: v })}
              />
            </FiltroSecao>

          </div>

          <div className="p-4 bg-gray-50 border-t border-gray-100 flex gap-2">
            <button
              onClick={() => { setFiltrosAtivos(FILTROS_INICIAIS); setFiltrosRasc(FILTROS_INICIAIS); setPainelAberto(false); }}
              className="flex-1 h-9 rounded-lg text-xs font-bold text-slate-500 hover:bg-gray-200 transition-colors"
            >
              Limpar
            </button>
            <button
              onClick={() => { setFiltrosAtivos(filtrosRasc); setPagina(1); setPainelAberto(false); }}
              className="flex-1 h-9 rounded-lg bg-[#1a2b4b] text-white text-xs font-bold shadow-md hover:opacity-90 transition-all"
            >
              Aplicar
            </button>
          </div>
        </div>
      )}

      {/* TABELA */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-50/50 border-y border-gray-100">
              <th className="w-14 px-6 py-4">
                <input
                  type="checkbox"
                  checked={todosSelecionados}
                  onChange={toggleTodos}
                  className="w-4 h-4 rounded border-gray-300 accent-[#1a2b4b] cursor-pointer"
                />
              </th>
              {["Setor", "Gestor", "OEE Médio", "Máquinas", "Operadores", "Ações"].map(col => (
                <th key={col} className="px-4 py-4 text-left font-semibold text-black uppercase text-xs tracking-wider">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {paginaAtual.map((s) => {
              const badge = badgeOEE(s.oeeMedio);
              const isSel = selecionados.has(s.id);
              return (
                <tr key={s.id} className={`group transition-colors ${isSel ? "bg-blue-50/40" : "hover:bg-gray-50"}`}>
                  <td className="px-6 py-4 text-center">
                    <input
                      type="checkbox"
                      checked={isSel}
                      onChange={() => toggleSelect(s.id)}
                      className="w-4 h-4 rounded border-gray-300 accent-[#1a2b4b] cursor-pointer"
                    />
                  </td>
                  <td className="px-4 py-4 text-black font-medium cursor-pointer transition-all">
                    {s.setor}
                  </td>
                  <td className="px-4 py-4 text-black font-medium">{s.gestor}</td>
                  <td className="px-4 py-4">
                    <span className="inline-flex px-2.5 py-1 rounded-full text-[11px] font-bold shadow-sm" style={{ background: badge.bg, color: badge.color }}>
                      {s.oeeMedio}%
                    </span>
                  </td>
                  <td className="px-4 py-4 text-black font-medium">{s.qtdMaquinas}</td>
                  <td className="px-4 py-4 text-black font-medium">{s.qtdOperadores}</td>
                  <td className="px-4 py-4 relative">
                    <button
                      onClick={() => setMenuAberto(menuAberto === s.id ? null : s.id)}
                      className="p-1.5 hover:bg-gray-200 rounded-lg text-gray-400 transition-colors"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                        <circle cx="12" cy="5" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="12" cy="19" r="1.5" />
                      </svg>
                    </button>
                    {menuAberto === s.id && (
                      <div
                        ref={menuRef}
                        className="absolute right-10 top-4 z-30 bg-white border border-gray-100 rounded-xl shadow-xl py-2 w-40 animate-in zoom-in-95 duration-150"
                      >
                        {["Ver Detalhes", "Editar", "Excluir"].map(acao => (
                          <button
                            key={acao}
                            onClick={() => setMenuAberto(null)} // Opcional: fecha ao clicar na ação
                            className={`w-full text-left px-4 py-2 text-xs font-semibold ${acao === 'Excluir' ? 'text-red-500 hover:bg-red-50' : 'text-slate-700 hover:bg-gray-50'}`}
                          >
                            {acao}
                          </button>
                        ))}
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {paginaAtual.length === 0 && (
          <div className="py-20 text-center text-gray-400 font-medium italic">
            Nenhum setor corresponde aos filtros aplicados.
          </div>
        )}
      </div>


      {/* PAGINAÇÃO */}
      <div className="flex items-center justify-center gap-8 py-10 border-t border-gray-100">
        {/* Botão Anterior */}
        <button
          onClick={() => setPagina((p) => Math.max(1, p - 1))}
          disabled={pagina === 1}
          className="w-12 h-9 flex items-center justify-center bg-[#0a1e3f] text-white text-xl font-bold rounded-lg hover:bg-slate-800 disabled:opacity-20 disabled:cursor-not-allowed transition-all shadow-md active:scale-95"
        >
          ‹
        </button>

        {/* Indicador de Página */}
        <div className="flex items-center gap-2 text-xl font-light text-slate-400 select-none">
          <span>Página</span>
          <span className="font-semibold text-slate-800 min-w-[1.5rem] text-center">
            {pagina}
          </span>
          <span>de</span>
          <span className="font-semibold text-slate-800 min-w-[1.5rem] text-center">
            {totalPaginas || 1}
          </span>
        </div>

        {/* Botão Próximo */}
        <button
          onClick={() => setPagina((p) => Math.min(totalPaginas, p + 1))}
          disabled={pagina >= totalPaginas || totalPaginas === 0}
          className="w-12 h-9 flex items-center justify-center bg-[#0a1e3f] text-white text-xl font-bold rounded-lg hover:bg-slate-800 disabled:opacity-20 disabled:cursor-not-allowed transition-all shadow-md active:scale-95"
        >
          ›
        </button>
      </div>
    </div>
  );
}