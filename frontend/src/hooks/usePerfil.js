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

  return {
    perfil,
    loading,
    erro,
    setorId: perfil?.id_setor ?? perfil?.setor?.id_setor ?? null,
    tipo: perfil?.tipo ?? perfil?.funcao ?? null
  };
}
