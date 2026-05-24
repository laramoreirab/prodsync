"use client";

import { useEffect, useState } from "react";
import { obterPerfil } from "@/services/authService";

export function usePerfil() {
  const [perfil, setPerfil] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    let ativo = true;

    async function carregarPerfil() {
      try {
        const dados = await obterPerfil();
        if (ativo) setPerfil(dados);
      } catch (error) {
        if (ativo) setErro(error);
      } finally {
        if (ativo) setLoading(false);
      }
    }

    carregarPerfil();

    return () => {
      ativo = false;
    };
  }, []);

  const setor =
    perfil?.setor ??
    perfil?.setores_geridos?.[0]?.setor ??
    null;

  return {
    perfil,
    loading,
    erro,
    setorId:
      perfil?.id_setor ??
      setor?.id_setor ??
      perfil?.setores_geridos?.[0]?.id_setor ??
      null,
    setorNome: setor?.nome_setor ?? setor?.nome ?? null,
    tipo: perfil?.tipo ?? perfil?.funcao ?? null
  };
}
