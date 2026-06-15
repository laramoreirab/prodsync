"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { enviarMensagemChat, analisarArquivoIA } from "@/services/aiService";
import { Send, X, Loader2, Expand, Shrink, Paperclip } from "lucide-react";
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
  const [carregando, setSincronizando] = useState(false);
  const [arquivosSelecionados, setArquivosSelecionados] = useState([]);
  const { perfil } = usePerfil();
  const scrollRef = useRef(null);
  const fileInputRef = useRef(null);

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

    if ((!textoParaEnviar.trim() && arquivosSelecionados.length === 0) || carregando) return;

    const novaMensagemUsuario = {
      role: "user",
      content: textoParaEnviar,
      attachments: arquivosSelecionados.map(file => ({
        name: file.name,
        type: file.type,
        url: file.type.startsWith('image/') ? URL.createObjectURL(file) : null
      }))
    };

    const novoHistorico = [...historico, novaMensagemUsuario];
    const arquivosParaEnviar = [...arquivosSelecionados];

    setHistorico(novoHistorico);
    setMensagem("");
    setArquivosSelecionados([]);
    setSincronizando(true);

    try {
      let data;

      if (arquivosParaEnviar.length > 0) {
        data = await analisarArquivoIA(arquivosParaEnviar, textoParaEnviar);
      } else {
        const contextoPagina = getPageContext();
        const instrucaoContexto = {
          role: "system",
          content: `Página atual: ${contextoPagina.url}. Dados da tela: ${JSON.stringify(contextoPagina)}`
        };

        // Limpa o histórico para enviar apenas role e content para a API
        const historicoLimpo = historico.map(({ role, content }) => ({ role, content }));
        data = await enviarMensagemChat(textoParaEnviar, [instrucaoContexto, ...historicoLimpo]);
      }

      if (data.sucesso) {
        setHistorico([...novoHistorico, { role: "assistant", content: data.resposta }]);
      }
    } catch (error) {
      console.error("Erro no chat:", error);
      const mensagemErro = error.message || "Ops! Tive um problema técnico. Tente novamente.";
      setHistorico([...novoHistorico, { role: "assistant", content: mensagemErro }]);
    } finally {
      setSincronizando(false);
      setArquivosSelecionados([]);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleArquivoChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setArquivosSelecionados(prev => [...prev, ...files]);
    }
    // Reset input to allow selecting the same file again if removed
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removerArquivo = (index) => {
    setArquivosSelecionados(prev => prev.filter((_, i) => i !== index));
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
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-9998"
          />
        )}
      </AnimatePresence>

      <div className={cn(
        "fixed z-9999 font-sans text-slate-900 transition-all duration-500 ease-in-out",
        isExpanded
          ? "inset-4 md:inset-10 flex items-center justify-center pointer-events-none"
          : "bottom-6 right-6 w-87.5 sm:w-105"
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
                  isExpanded ? "w-full max-w-300 h-full max-h-[85vh]" : "w-full h-150"
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
                      isExpanded ? "w-300 h-300" : "w-150 h-150"
                  )}
                  style={{ background: 'conic-gradient(from 0deg, #1e3a8a, #3b82f6, #bfdbfe, #1e3a8a)' }}
                />
              </div>

              <div className="flex justify-end p-4 absolute right-0 top-0 z-20 gap-1">
                  <button onClick={() => setIsExpanded(!isExpanded)} className="p-2 hover:bg-slate-100/50 rounded-full transition-colors text-slate-400 cursor-pointer">
                    {isExpanded ? <Shrink size={20} /> : <Expand size={20} />}
                  </button>
                  <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-slate-100/50 rounded-full transition-colors text-slate-400 cursor-pointer">
                    <X size={20} />
                  </button>
              </div>

              <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 flex flex-col gap-4 scrollbar-hide pt-12 relative z-10 bg-transparent">
                {historico.length === 0 ? (
                  <div className="flex-1 flex flex-col justify-center items-center text-center px-4">
                    <motion.div layout className="mb-8">
                       <h2 className={cn("font-semibold text-slate-800 tracking-tight transition-all duration-300", isExpanded ? "text-4xl" : "text-2xl")}>
                          {nomeUsuario === "Usuário" ? "Olá!" : `Olá, ${nomeUsuario}!`}
                       </h2>
                       <p className={cn("text-slate-500 mt-2 font-medium transition-all duration-300", isExpanded ? "text-xl" : "text-lg")}>
                          Como posso ajudar?
                       </p>
                    </motion.div>
                    <div className={cn("grid gap-3 w-full mt-auto mb-4 transition-all duration-500", isExpanded ? "grid-cols-2 max-w-2xl" : "grid-cols-2")}>
                      {sugestoes.map((sug, i) => (
                        <button
                          key={i}
                          onClick={() => handleEnviar(null, sug.prompt)}
                          disabled={carregando}
                          className="flex flex-col text-left p-4 bg-white/60 backdrop-blur-sm hover:bg-white/80 transition-colors rounded-2xl border border-slate-200/50 group cursor-pointer disabled:cursor-not-allowed"
                        >
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
                          msg.role === "user" ? "bg-[#1e3a8a] text-white rounded-[1.2rem] rounded-tr-none" : "bg-white/80 backdrop-blur-md text-slate-800 rounded-[1.2rem] rounded-tl-none border border-white/20"
                        )}>
                          {msg.role === "assistant" ? (
                            <div className="markdown-container prose prose-sm dark:prose-invert wrap-break-word max-w-full">
                              <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                components={{
                                  table: ({node, ...props}) => (
                                    <div className="overflow-x-auto w-full my-4 rounded-xl border border-slate-200 shadow-sm bg-white/50">
                                      <table className="min-w-full border-collapse" {...props} />
                                    </div>
                                  ),
                                  th: ({node, ...props}) => (
                                    <th className="border-b border-slate-200 p-3 bg-slate-50 text-left font-bold text-[12px] uppercase tracking-wider text-slate-700" {...props} />
                                  ),
                                  td: ({node, ...props}) => (
                                    <td className="border-b border-slate-100 p-3 text-[13px] text-slate-600 leading-relaxed" {...props} />
                                  ),
                                  hr: () => null,
                                }}
                              >
                                {msg.content}
                              </ReactMarkdown>
                            </div>
                          ) : (
                            <div className="flex flex-col gap-3">
                              {msg.attachments && msg.attachments.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                  {msg.attachments.map((file, idx) => (
                                    <div key={idx} className="bg-white rounded-2xl overflow-hidden border border-slate-200 flex flex-col w-28 h-28 shadow-sm transition-all hover:shadow-md group shrink-0">
                                      <div className="flex-1 relative bg-slate-50/50 flex items-center justify-center p-3">
                                        {file.url ? (
                                          <img src={file.url} alt={file.name} className="w-full h-full object-contain" />
                                        ) : (
                                          <div className="relative w-10 h-14 bg-white border border-slate-200 shadow-sm rounded-sm flex items-center justify-center">
                                            <div className="absolute top-0 left-0 bg-red-500 text-white text-[7px] font-black px-1 py-0.5 rounded-br-sm">
                                              {file.name.split('.').pop().toUpperCase()}
                                            </div>
                                            <div className="flex flex-col gap-1">
                                              <div className="w-5 h-0.5 bg-slate-100"></div>
                                              <div className="w-5 h-0.5 bg-slate-100"></div>
                                              <div className="w-3 h-0.5 bg-slate-100"></div>
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                      <div className="bg-white px-2.5 py-2 border-t border-slate-100">
                                        <span className="text-[10px] text-slate-800 truncate block font-semibold">{file.name}</span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                              {msg.content && <div className="leading-relaxed">{msg.content}</div>}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    {carregando && (
                      <div className="flex justify-start">
                        <div className="bg-white/80 backdrop-blur-md rounded-[1.2rem] rounded-tl-none px-4 py-3 shadow-sm">
                          <Loader2 className="h-4 w-4 animate-spin text-[#1e3a8a]" />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="p-4 backdrop-blur-md z-20 flex flex-col items-center w-full gap-3">
                <div className={cn("w-full flex flex-col gap-3", isExpanded && "max-w-3xl")}>
                  {arquivosSelecionados.length > 0 && (
                    <div className="flex gap-3 overflow-x-auto w-full pt-3 pb-2 scrollbar-hide px-2">
                      {arquivosSelecionados.map((file, idx) => {
                        const isImage = file.type.startsWith('image/');
                        const previewUrl = isImage ? URL.createObjectURL(file) : null;

                        return (
                          <motion.div
                            key={`${file.name}-${idx}`}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="relative shrink-0 group"
                          >
                            <div className={cn(
                                "rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden flex flex-col items-center justify-center relative transition-all",
                                isExpanded ? "w-32 h-32" : "w-24 h-24"
                            )}>
                              {isImage ? (
                                  <img
                                      src={previewUrl}
                                      alt={file.name}
                                      className="w-full h-full object-cover"
                                      onLoad={() => URL.revokeObjectURL(previewUrl)}
                                  />
                              ) : (
                                  <div className="flex flex-col items-center gap-1 p-2 text-center">
                                    <div className="bg-red-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-sm uppercase mb-1">
                                      {file.name.split('.').pop()}
                                    </div>
                                    <span className={cn("text-slate-500 truncate px-1 font-semibold", isExpanded ? "text-[11px] w-28" : "text-[9px] w-20")}>{file.name}</span>
                                  </div>
                              )}
                            </div>
                            <button
                              type="button"
                              onClick={() => removerArquivo(idx)}
                              disabled={carregando}
                              className="absolute -top-2 -right-2 bg-white border border-slate-200 rounded-full p-1.5 shadow-md text-slate-400 hover:text-red-500 hover:scale-110 transition-all z-10 cursor-pointer disabled:cursor-not-allowed"
                            >
                              <X size={12} />
                            </button>
                          </motion.div>
                        );
                      })}
                    </div>
                  )}
                  <form onSubmit={handleEnviar} className="relative flex items-center gap-2 w-full transition-all duration-500">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleArquivoChange}
                      className="hidden"
                      accept=".pdf,.png,.jpg,.jpeg,.txt,.csv,.json"
                      multiple
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={carregando}
                      className={cn(
                        "flex items-center justify-center w-10 h-10 rounded-full transition-all shrink-0 cursor-pointer disabled:cursor-not-allowed",
                        arquivosSelecionados.length > 0 ? "bg-[#1e3a8a]/10 text-[#1e3a8a]" : "hover:bg-slate-100 text-slate-500"
                      )}
                    >
                      <Paperclip size={20} />
                    </button>
                    <input
                      type="text"
                      value={mensagem}
                      onChange={(e) => setMensagem(e.target.value)}
                      placeholder={arquivosSelecionados.length > 0 ? "O que devo fazer com estes arquivos?" : "Pergunte ao Sy..."}
                      className="w-full shadow-md border bg-white border-slate-200 rounded-full py-4 px-6 pr-14 text-sm  transition-all placeholder:text-slate-400 text-slate-900 disabled:cursor-not-allowed"
                      disabled={carregando}
                    />
                    <button type="submit" disabled={(!mensagem.trim() && arquivosSelecionados.length === 0) || carregando} className="absolute right-2 w-10 h-10 bg-[#25245d] rounded-full flex items-center justify-center text-white hover:scale-105 active:scale-95 transition-all cursor-pointer disabled:cursor-not-allowed">
                      <Send size={18} fill="currentColor" />
                    </button>
                  </form>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {!isOpen && (
        <button onClick={() => setIsOpen(true)} className="fixed bottom-6 right-6 w-16 h-16 rounded-full bg-white shadow-xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all border border-slate-100 overflow-hidden z-[9999]">
            <div className="relative w-full h-full flex items-center justify-center">
                <img src="/ia_trigger.svg" alt="Sy AI" className="w-[75%] h-[75%] object-contain" />
            </div>
        </button>
      )}
    </>
  );
};

export default ChatAI;
