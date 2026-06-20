"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LoadingState } from "@/components/AnimatedComponents";
import { apiFetch } from "@/lib/api";
import { getUserFromToken } from "@/lib/auth";

export default function OperadorMaquinasRedirectPage() {
  const router = useRouter();
  const [message, setMessage] = useState("Sincronizando máquina");

  useEffect(() => {
    let active = true;
    const semMaquina = new URLSearchParams(window.location.search).get("semMaquina") === "1";

    if (semMaquina) {
      setMessage("Nenhuma máquina vinculada a este operador.");
      return () => {
        active = false;
      };
    }

    async function redirectToAssignedMachine() {
      const usuario = getUserFromToken();
      const idOperador = usuario?.id_usuario;

      if (!idOperador) {
        if (active) setMessage("Não foi possível identificar o operador.");
        return;
      }

      try {
        const resposta = await apiFetch(
          `/api/maquinas/obter-maquina-operador/${idOperador}`,
        );
        const idMaquina = resposta?.id_maquina ?? resposta?.dados?.id_maquina;

        if (!idMaquina) {
          if (active) setMessage("Nenhuma máquina vinculada a este operador.");
          return;
        }

        router.replace(`/operador/maquinas/${idMaquina}`);
      } catch (error) {
        console.error("Erro ao redirecionar para maquina do operador:", error);
        if (active) {
          setMessage("Não foi possível carregar a máquina do operador.");
        }
      }
    }

    redirectToAssignedMachine();

    return () => {
      active = false;
    };
  }, [router]);

  return <LoadingState message={message} />;
}
