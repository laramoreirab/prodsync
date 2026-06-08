"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { enviarMensagemChat } from "@/services/aiService";
import { Send, X, Loader2, Expand, Shrink } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { usePerfil } from "@/hooks/usePerfil";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Image from 'next/image';
import { getPageContext } from "@/lib/pageContext";

const ChatAI = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [historico, setHistorico] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const { perfil } = usePerfil();
  const scrollRef = useRef(null);

  const nomeUsuario = perfil?.nome?.split(' ')[0] || "Usuário";

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [historico, isOpen, isExpanded]);

  useEffect(() => {
    if (!isOpen) setIsExpanded(false);
  }, [isOpen]);

  const handleEnviar = async (e, msgSobrescrever) => {
    if (e) e.preventDefault();
    const textoParaEnviar = msgSobrescrever || mensagem;

    if (!textoParaEnviar.trim() || carregando) return;

    const novaMensagemUsuario = { role: "user", content: textoParaEnviar };
    const novoHistorico = [...historico, novaMensagemUsuario];

    setHistorico(novoHistorico);
    setMensagem("");
    setCarregando(true);

    try {
      const contextoPagina = getPageContext();
      const instrucaoContexto = {
        role: "system",
        content: `Página atual: ${contextoPagina.url}. Dados da tela: ${JSON.stringify(contextoPagina)}`
      };

      const data = await enviarMensagemChat(textoParaEnviar, [instrucaoContexto, ...historico]);
      if (data.sucesso) {
        setHistorico([...novoHistorico, { role: "assistant", content: data.resposta }]);
      }
    } catch (error) {
      console.error("Erro no chat:", error);
      setHistorico([...novoHistorico, { role: "assistant", content: "Ops! Tive um problema técnico. Tente novamente." }]);
    } finally {
      setCarregando(false);
    }
  };

  const sugestoes = [
    {
      titulo: "Como está o OEE hoje?",
      descricao: "Analise o desempenho geral das máquinas agora.",
      prompt: "Como está o OEE das máquinas hoje?"
    },
    {
      titulo: "Resumo de paradas",
      descricao: "Veja os principais motivos de downtime do dia.",
      prompt: "Me dê um resumo das principais paradas de hoje."
    }
  ];

  return (
    <>
      <AnimatePresence>
        {isOpen && isExpanded && (
          <motion.div
            data-print-hide
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsExpanded(false)}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[9998]"
          />
        )}
      </AnimatePresence>

      <div className={cn(
        "fixed z-[9999] font-sans text-slate-900 transition-all duration-500 ease-in-out",
        isExpanded
          ? "inset-4 md:inset-10 flex items-center justify-center pointer-events-none"
          : "bottom-6 right-6 w-[350px] sm:w-[420px]"
      )} data-print-hide>
        <AnimatePresence mode="wait">
          {isOpen && (
            <motion.div
              layout
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className={cn(
                  "bg-white rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden border border-slate-100 relative pointer-events-auto",
                  isExpanded ? "w-full max-w-[900px] h-full max-h-[800px]" : "w-full h-[600px]"
              )}
            >
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden z-0">
                <motion.div
                  animate={{
                    scale: [1, 1.15, 1],
                    rotate: [0, 360],
                    x: [0, 15, -15, 0],
                    y: [0, -10, 10, 0],
                  }}
                  transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                  className={cn(
                      "rounded-full opacity-[0.3] blur-[100px] transition-all duration-500",
                      isExpanded ? "w-[1200px] h-[1200px]" : "w-[600px] h-[600px]"
                  )}
                  style={{ background: 'conic-gradient(from 0deg, #1e3a8a, #3b82f6, #bfdbfe, #1e3a8a)' }}
                />
              </div>

              <div className="flex justify-end p-4 absolute right-0 top-0 z-20 gap-1">
                  <button onClick={() => setIsExpanded(!isExpanded)} className="p-2 hover:bg-slate-100/50 rounded-full transition-colors text-slate-400">
                    {isExpanded ? <Shrink size={20} /> : <Expand size={20} />}
                  </button>
                  <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-slate-100/50 rounded-full transition-colors text-slate-400">
                    <X size={20} />
                  </button>
              </div>

              <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 flex flex-col gap-4 scrollbar-hide pt-12 relative z-10 bg-transparent">
                {historico.length === 0 ? (
                  <div className="flex-1 flex flex-col justify-center items-center text-center px-4">
                    <motion.div layout className="mb-8">
                       <h2 className={cn("font-semibold text-slate-800 tracking-tight transition-all duration-300", isExpanded ? "text-4xl" : "text-2xl")}>
                          Olá, {nomeUsuario}!
                       </h2>
                       <p className={cn("text-slate-500 mt-2 font-medium transition-all duration-300", isExpanded ? "text-xl" : "text-lg")}>
                          Como posso ajudar?
                       </p>
                    </motion.div>
                    <div className={cn("grid gap-3 w-full mt-auto mb-4 transition-all duration-500", isExpanded ? "grid-cols-2 max-w-2xl" : "grid-cols-2")}>
                      {sugestoes.map((sug, i) => (
                        <button key={i} onClick={() => handleEnviar(null, sug.prompt)} className="flex flex-col text-left p-4 bg-white/60 backdrop-blur-sm hover:bg-white/80 transition-colors rounded-2xl border border-slate-200/50 group">
                          <span className="text-sm font-bold text-slate-700 mb-1 group-hover:text-primary transition-colors">{sug.titulo}</span>
                          <span className="text-[11px] leading-relaxed text-slate-500">{sug.descricao}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className={cn("flex flex-col gap-4 w-full mx-auto transition-all duration-500", isExpanded && "max-w-3xl")}>
                    {historico.map((msg, index) => (
                      <div key={index} className={cn("flex w-full", msg.role === "user" ? "justify-end" : "justify-start")}>
                        <div className={cn(
                          "max-w-[85%] px-4 py-3 text-sm shadow-sm transition-all duration-300",
                          msg.role === "user" ? "bg-[#4B48D6] text-white rounded-[1.2rem] rounded-tr-none" : "bg-white/80 backdrop-blur-md text-slate-800 rounded-[1.2rem] rounded-tl-none border border-white/20"
                        )}>
                          {msg.role === "assistant" ? (
                            <div className="markdown-container prose prose-sm dark:prose-invert break-words max-w-full">
                              <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                components={{
                                  table: ({node, ...props}) => (
                                    <div className="overflow-x-auto w-full my-3 rounded-xl border border-slate-200/60 shadow-sm bg-white/40">
                                      <table className="min-w-full border-collapse" {...props} />
                                    </div>
                                  ),
                                  th: ({node, ...props}) => (
                                    <th className="border-b border-slate-200/60 p-2 bg-slate-100/50 text-left font-bold text-[10px] uppercase tracking-tight text-slate-600" {...props} />
                                  ),
                                  td: ({node, ...props}) => (
                                    <td className="border-b border-slate-100/40 p-2 text-[11px] text-slate-700" {...props} />
                                  ),
                                }}
                              >
                                {msg.content}
                              </ReactMarkdown>
                            </div>
                          ) : msg.content}
                        </div>
                      </div>
                    ))}
                    {carregando && (
                      <div className="flex justify-start">
                        <div className="bg-white/80 backdrop-blur-md rounded-[1.2rem] rounded-tl-none px-4 py-3 shadow-sm">
                          <Loader2 className="h-4 w-4 animate-spin text-[#4B48D6]" />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="p-4 backdrop-blur-md z-20 flex justify-center w-full">
                <form onSubmit={handleEnviar} className={cn("relative flex items-center gap-2 w-full transition-all duration-500", isExpanded && "max-w-3xl")}>
                  <input type="text" value={mensagem} onChange={(e) => setMensagem(e.target.value)} placeholder="Pergunte ao Sy..." className="w-full shadow-md border bg-white border-slate-200 rounded-full py-4 px-6 pr-14 text-sm  transition-all placeholder:text-slate-400 text-slate-900" disabled={carregando} />
                  <button type="submit" disabled={!mensagem.trim() || carregando} className="absolute right-2 w-10 h-10 bg-[#25245d] rounded-full flex items-center justify-center text-white hover:scale-105 active:scale-95 transition-all ">
                    <Send size={18} fill="currentColor" />
                  </button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {!isOpen && (
        <button data-print-hide onClick={() => setIsOpen(true)} className="fixed bottom-6 right-6 w-16 h-16 rounded-full bg-white shadow-xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all border border-slate-100 overflow-hidden z-[9999]">
            <div className="relative w-full h-full flex items-center justify-center">
                <img src="/ia_trigger.svg" alt="Sy AI" className="w-[75%] h-[75%] object-contain" />
            </div>
        </button>
      )}
    </>
  );
};

export default ChatAI;
